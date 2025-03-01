"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function NotificationSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Bildirim tercihleri için state
  const [emailNotifications, setEmailNotifications] = useState({
    marketing: true,
    bookingConfirmation: true,
    bookingReminder: true,
    bookingCancellation: true,
    bookingUpdates: true,
    reviews: true,
    promotions: false,
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    bookingConfirmation: true,
    bookingReminder: true,
    bookingCancellation: true,
    messages: true,
    reviews: true,
    promotions: false,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Bu sayfayı görüntülemek için giriş yapmalısınız");
      router.push("/giris");
      return;
    }

    // Burada API'den mevcut bildirim ayarlarını yükleyebilirsiniz
    // loadNotificationSettings();
  }, [status, router]);

  const saveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Burada gerçek bir API çağrısı yapılacak
      // const response = await fetch('/api/user/notification-settings', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     emailNotifications,
      //     pushNotifications,
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Bildirim ayarları güncellenirken bir hata oluştu');
      // }

      // Simülasyon için gecikme ekleyelim
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Bildirim ayarlarınız başarıyla güncellendi");
    } catch (error) {
      console.error("Bildirim ayarları güncellenirken hata oluştu:", error);
      toast.error("Bildirim ayarları güncellenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // Yükleniyor durumunda gösterilecek içerik
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Toggle işlevi
  const toggleEmailSetting = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const togglePushSetting = (key: keyof typeof pushNotifications) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Bildirim Ayarları</h1>
          <Link 
            href="/profil" 
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; Profile Dön
          </Link>
        </div>

        <div className="space-y-8">
          {/* E-posta Bildirimleri */}
          <div>
            <h2 className="text-lg font-semibold mb-4">E-posta Bildirimleri</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pazarlama E-postaları</p>
                  <p className="text-sm text-gray-500">Özel teklifler, kampanyalar ve güncellemeler hakkında e-postalar alın</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={emailNotifications.marketing}
                    onChange={() => toggleEmailSetting("marketing")}
                    disabled={isLoading}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rezervasyon Onayları</p>
                  <p className="text-sm text-gray-500">Rezervasyon yaptığınızda onay e-postaları alın</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={emailNotifications.bookingConfirmation}
                    onChange={() => toggleEmailSetting("bookingConfirmation")}
                    disabled={isLoading}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rezervasyon Hatırlatıcıları</p>
                  <p className="text-sm text-gray-500">Yaklaşan rezervasyonlarınız için hatırlatıcı e-postaları alın</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={emailNotifications.bookingReminder}
                    onChange={() => toggleEmailSetting("bookingReminder")}
                    disabled={isLoading}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rezervasyon İptalleri</p>
                  <p className="text-sm text-gray-500">Rezervasyonlarınız iptal edildiğinde bildirim alın</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={emailNotifications.bookingCancellation}
                    onChange={() => toggleEmailSetting("bookingCancellation")}
                    disabled={isLoading}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Yorum Bildirimleri</p>
                  <p className="text-sm text-gray-500">Aldığınız hizmetlere yorumlar yapıldığında bildirim alın</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={emailNotifications.reviews}
                    onChange={() => toggleEmailSetting("reviews")}
                    disabled={isLoading}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Push Bildirimleri */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Push Bildirimleri</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rezervasyon Onayları</p>
                  <p className="text-sm text-gray-500">Rezervasyon yaptığınızda anında bildirim alın</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={pushNotifications.bookingConfirmation}
                    onChange={() => togglePushSetting("bookingConfirmation")}
                    disabled={isLoading}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rezervasyon Hatırlatıcıları</p>
                  <p className="text-sm text-gray-500">Yaklaşan rezervasyonlarınız için hatırlatıcı bildirimleri alın</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={pushNotifications.bookingReminder}
                    onChange={() => togglePushSetting("bookingReminder")}
                    disabled={isLoading}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mesajlar</p>
                  <p className="text-sm text-gray-500">Yeni mesaj aldığınızda bildirim alın</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={pushNotifications.messages}
                    onChange={() => togglePushSetting("messages")}
                    disabled={isLoading}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Promosyonlar ve Teklifler</p>
                  <p className="text-sm text-gray-500">Özel teklifler ve promosyonlar hakkında bildirim alın</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={pushNotifications.promotions}
                    onChange={() => togglePushSetting("promotions")}
                    disabled={isLoading}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end pt-4">
            <button
              onClick={saveSettings}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 