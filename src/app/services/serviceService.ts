import { supabase } from "@/app/lib/supabase";

export type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  created_at: string;
  provider_id?: string;
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Hizmet verileri alınırken hata oluştu:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Hizmet servisi hatası:', error);
    return [];
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`${id} ID'li hizmet alınırken hata oluştu:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Hizmet servisi hatası:', error);
    return null;
  }
}

export async function getServicesByCategory(category: string): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`${category} kategorisindeki hizmetler alınırken hata oluştu:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Hizmet servisi hatası:', error);
    return [];
  }
}

export async function createService(serviceData: Omit<Service, 'id' | 'created_at'>): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();
    
    if (error) {
      console.error('Hizmet oluşturulurken hata oluştu:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Hizmet servisi hatası:', error);
    return null;
  }
}

export async function updateService(id: string, serviceData: Partial<Service>): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`${id} ID'li hizmet güncellenirken hata oluştu:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Hizmet servisi hatası:', error);
    return null;
  }
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`${id} ID'li hizmet silinirken hata oluştu:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Hizmet servisi hatası:', error);
    return false;
  }
} 