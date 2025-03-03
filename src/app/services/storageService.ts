import { supabase } from "@/app/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'service-images';

/**
 * Supabase Storage'a dosya yükler
 * @param file Yüklenecek dosya
 * @param path İsteğe bağlı depolama yolu
 * @returns Yüklenen dosya URL'si veya hata durumunda null
 */
export async function uploadFile(file: File, path?: string): Promise<string | null> {
  try {
    // Benzersiz dosya adı oluştur
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    // Dosyayı yükle
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Aynı isimde dosya varsa üzerine yazma
      });

    if (error) {
      console.error('Dosya yükleme hatası:', error);
      return null;
    }

    // Dosya için public URL al
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Depolama servisi hatası:', error);
    return null;
  }
}

/**
 * Dosya URL'si ile dosyayı siler
 * @param url Silinecek dosyanın URL'si
 * @returns İşlem başarılıysa true, değilse false
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    // URL'den dosya yolunu çıkar
    const filePathMatch = url.match(new RegExp(`${BUCKET_NAME}/([^?#]+)`));
    
    if (!filePathMatch) {
      console.error('Geçersiz dosya URL\'si');
      return false;
    }
    
    const filePath = filePathMatch[1];
    
    // Dosyayı sil
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
    
    if (error) {
      console.error('Dosya silme hatası:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Depolama servisi hatası:', error);
    return false;
  }
}

/**
 * Dosya URL'lerinden bir listeyi toplu olarak siler
 * @param urls Silinecek dosyaların URL'leri
 * @returns Başarıyla silinen dosya sayısı
 */
export async function deleteMultipleFiles(urls: string[]): Promise<number> {
  try {
    let successCount = 0;
    
    for (const url of urls) {
      const success = await deleteFile(url);
      if (success) successCount++;
    }
    
    return successCount;
  } catch (error) {
    console.error('Toplu dosya silme hatası:', error);
    return 0;
  }
} 