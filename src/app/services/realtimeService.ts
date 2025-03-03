import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Mesaj tablosunu gerçek zamanlı izleyen bir hook
 * @param receiverId Alıcı kullanıcı ID'si
 * @returns Yeni mesaj sayısı ve aboneliği temizleme fonksiyonu
 */
export function useMessageNotifications(receiverId: string) {
  const [newMessages, setNewMessages] = useState(0);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // Aboneliği temizleme yardımcı fonksiyonu
    const cleanup = async () => {
      if (channel) {
        await channel.unsubscribe();
      }
    };

    if (receiverId) {
      // Yeni mesajlar için gerçek zamanlı abonelik oluştur
      const newChannel = supabase
        .channel('messages-notification')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${receiverId}`
          },
          (payload) => {
            // Yeni bir mesaj geldiğinde sayacı artır
            setNewMessages((count) => count + 1);
          }
        )
        .subscribe();

      setChannel(newChannel);
    }

    // Bileşen unmount olduğunda aboneliği temizle
    return () => {
      cleanup();
    };
  }, [receiverId]);

  // Okundu olarak işaretlendiğinde sayacı sıfırla
  const resetMessageCount = () => {
    setNewMessages(0);
  };

  return { newMessages, resetMessageCount };
}

/**
 * Belirli bir hizmet sağlayıcının randevularını gerçek zamanlı izleyen bir hook
 * @param providerId Hizmet sağlayıcı ID'si
 * @returns Randevular ve yenilenme zamanı
 */
export function useProviderAppointments(providerId: string) {
  const [appointments, setAppointments] = useState([]);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // İlk veri yüklemesi
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('provider_id', providerId)
        .order('appointment_date', { ascending: true });
      
      if (data && !error) {
        setAppointments(data);
      }
    };

    // Aboneliği temizleme fonksiyonu
    const cleanup = async () => {
      if (channel) {
        await channel.unsubscribe();
      }
    };

    if (providerId) {
      fetchAppointments();

      // Randevular için gerçek zamanlı değişiklikler
      const newChannel = supabase
        .channel('appointments-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // INSERT, UPDATE, DELETE tümünü izle
            schema: 'public',
            table: 'appointments',
            filter: `provider_id=eq.${providerId}`
          },
          (payload) => {
            // Bir değişiklik olduğunda yenileme zamanını güncelle
            setRefreshTimestamp(Date.now());
            fetchAppointments(); // Verileri yeniden getir
          }
        )
        .subscribe();

      setChannel(newChannel);
    }

    // Cleanup
    return () => {
      cleanup();
    };
  }, [providerId]);

  return { appointments, refreshTimestamp };
}

/**
 * Bir sağlayıcının hizmetlerini gerçek zamanlı izlemek için hook
 */
export function useProviderServices(providerId: string) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let channel: RealtimeChannel | null = null;

    // Hizmetleri getir
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId);
      
      if (mounted) {
        if (data && !error) {
          setServices(data);
        }
        setLoading(false);
      }
    };

    if (providerId) {
      fetchServices();

      // Gerçek zamanlı değişiklikleri izle
      channel = supabase
        .channel('services-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'services',
            filter: `provider_id=eq.${providerId}`
          },
          (payload) => {
            fetchServices();
          }
        )
        .subscribe();
    }

    // Temizleme
    return () => {
      mounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [providerId]);

  return { services, loading };
} 