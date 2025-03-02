import { NextResponse } from 'next/server';

// Kategori tipi tanımı
interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  parentId: string | null;
  isPopular: boolean;
}

// GET - Kategorileri getir
export async function GET() {
  try {
    // TODO: Gerçek veritabanı entegrasyonu eklendikten sonra
    // buradaki mock veriler gerçek verilerle değiştirilecek
    
    const categories: Category[] = [
      {
        id: "1",
        name: "Boya",
        description: "Evinizin iç ve dış boyası için profesyonel hizmet",
        icon: "🎨",
        parentId: null,
        isPopular: true
      },
      {
        id: "2",
        name: "Tadilat",
        description: "Her türlü ev tadilat ve renovasyon işleri",
        icon: "🔨",
        parentId: null,
        isPopular: false
      },
      {
        id: "3", 
        name: "Tesisat",
        description: "Su, elektrik ve doğalgaz tesisatı kurulum ve tamir",
        icon: "🔧",
        parentId: null,
        isPopular: false
      },
      {
        id: "4",
        name: "Temizlik",
        description: "Eviniz için kapsamlı temizlik hizmetleri",
        icon: "🧹",
        parentId: null,
        isPopular: true
      },
      {
        id: "5",
        name: "Nakliyat",
        description: "Ev ve ofis taşıma hizmetleri",
        icon: "🚚",
        parentId: null,
        isPopular: true
      }
    ];
    
    return NextResponse.json({ 
      success: true, 
      categories 
    });
  } catch (error) {
    console.error('Kategoriler getirilirken hata oluştu:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Kategoriler getirilirken bir hata oluştu'
      },
      { status: 500 }
    );
  }
} 