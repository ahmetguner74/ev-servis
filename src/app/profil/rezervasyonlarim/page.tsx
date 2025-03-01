"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/Card";
import { Skeleton } from "@/app/components/ui/Skeleton";

// Rezervasyon tipi tanımı
type Reservation = {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  providerId: string;
  providerName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  price: number;
  createdAt: string;
};

export default function MyReservationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Sahte rezervasyon verileri oluşturan yardımcı fonksiyon
  const generateMockReservations = () => {
    const statuses: ('PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED')[] = [
      'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'
    ];
    
    const serviceNames = [
      'Ev Temizliği', 'Klima Bakımı', 'Boya İşleri', 'Tadilat', 
      'Bahçe Düzenleme', 'Mobilya Montajı', 'Elektrik Tamiratı', 'Su Tesisatı'
    ];
    
    const providerNames = [
      'Ahmet Temizlik', 'Mehmet Teknik Servis', 'Ayşe Dekorasyon', 
      'Ali Tadilat', 'Fatma Bahçecilik', 'Mustafa Montaj'
    ];

    const mockReservations: Reservation[] = [];
    
    // Son 10 gün için rezervasyonlar oluştur
    for (let i = 0; i < 10; i++) {
      const today = new Date();
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomServiceName = serviceNames[Math.floor(Math.random() * serviceNames.length)];
      const randomProviderName = providerNames[Math.floor(Math.random() * providerNames.length)];
      
      mockReservations.push({
        id: `res-${i + 1}`,
        serviceId: `srv-${Math.floor(Math.random() * 100)}`,
        serviceName: randomServiceName,
        serviceImage: `/images/services/${i % 5 + 1}.jpg`,
        providerId: `prov-${Math.floor(Math.random() * 100)}`,
        providerName: randomProviderName,
        date: date.toISOString().split('T')[0],
        startTime: `${10 + Math.floor(Math.random() * 8)}:00`,
        endTime: `${14 + Math.floor(Math.random() * 6)}:00`,
        status: randomStatus,
        price: Math.floor(Math.random() * 500) + 100,
        createdAt: new Date(date.getTime() - 86400000 * Math.floor(Math.random() * 10)).toISOString(),
      });
    }
    
    return mockReservations;
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Bu sayfayı görüntülemek için giriş yapmalısınız");
      router.push("/giris");
      return;
    }

    // Gerçek bir uygulamada API'den rezervasyonları çekeceğiz
    // fetchReservations();
    
    // Sahte veri ile test için
    setTimeout(() => {
      setReservations(generateMockReservations());
      setLoading(false);
    }, 1000);
  }, [status, router]);

  // Rezervasyonları filtreleme
  const filteredReservations = reservations.filter(reservation => {
    if (activeTab === "all") return true;
    return reservation.status.toLowerCase() === activeTab.toLowerCase();
  });

  // Rezervasyon iptali
  const cancelReservation = (id: string) => {
    if (window.confirm("Bu rezervasyonu iptal etmek istediğinizden emin misiniz?")) {
      // Gerçek bir uygulamada API çağrısı yapılır
      // API çağrısını simüle edelim
      setLoading(true);
      setTimeout(() => {
        setReservations(prevReservations => 
          prevReservations.map(res => 
            res.id === id ? { ...res, status: 'CANCELLED' } : res
          )
        );
        setLoading(false);
        toast.success("Rezervasyon başarıyla iptal edildi");
      }, 800);
    }
  };

  // Duruma göre renk ve etiket belirleme
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Onay Bekliyor' };
      case 'CONFIRMED':
        return { color: 'bg-blue-100 text-blue-800', label: 'Onaylandı' };
      case 'COMPLETED':
        return { color: 'bg-green-100 text-green-800', label: 'Tamamlandı' };
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-800', label: 'İptal Edildi' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Bilinmiyor' };
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Rezervasyonlarım</h1>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Skeleton className="h-32 w-32 rounded-md flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                      <div className="flex gap-2 mt-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Rezervasyonlarım</h1>
        <Link 
          href="/profil" 
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Profile Dön
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <CardTitle>Rezervasyon Geçmişi</CardTitle>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 text-sm rounded-full ${activeTab === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Tümü
              </button>
              <button 
                onClick={() => setActiveTab("pending")}
                className={`px-3 py-1 text-sm rounded-full ${activeTab === "pending" 
                  ? "bg-yellow-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Bekleyen
              </button>
              <button 
                onClick={() => setActiveTab("confirmed")}
                className={`px-3 py-1 text-sm rounded-full ${activeTab === "confirmed" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Onaylanan
              </button>
              <button 
                onClick={() => setActiveTab("completed")}
                className={`px-3 py-1 text-sm rounded-full ${activeTab === "completed" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Tamamlanan
              </button>
              <button 
                onClick={() => setActiveTab("cancelled")}
                className={`px-3 py-1 text-sm rounded-full ${activeTab === "cancelled" 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                İptal
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReservations.length > 0 ? (
            <div className="space-y-6">
              {filteredReservations.map((reservation) => {
                const statusDetails = getStatusDetails(reservation.status);
                return (
                  <div key={reservation.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-32 h-32 bg-gray-200 rounded-md flex-shrink-0">
                          <img 
                            src={reservation.serviceImage || "/images/placeholder.jpg"} 
                            alt={reservation.serviceName}
                            className="w-full h-full object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">{reservation.serviceName}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.color} mt-2 md:mt-0`}>
                              {statusDetails.label}
                            </span>
                          </div>
                          
                          <p className="text-gray-600">Sağlayıcı: {reservation.providerName}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-sm text-gray-500">Tarih</p>
                              <p className="font-medium">{new Date(reservation.date).toLocaleDateString('tr-TR', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Saat</p>
                              <p className="font-medium">{reservation.startTime} - {reservation.endTime}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Fiyat</p>
                              <p className="font-medium">{reservation.price.toLocaleString('tr-TR')} ₺</p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Oluşturulma</p>
                              <p className="font-medium">{new Date(reservation.createdAt).toLocaleDateString('tr-TR')}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Link 
                              href={`/rezervasyon/${reservation.id}`}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                              Detayları Görüntüle
                            </Link>
                            
                            {(reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') && (
                              <button 
                                onClick={() => cancelReservation(reservation.id)}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                              >
                                İptal Et
                              </button>
                            )}
                            
                            {reservation.status === 'COMPLETED' && (
                              <Link 
                                href={`/yorum-yap/${reservation.serviceId}`}
                                className="px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200 text-sm"
                              >
                                Yorum Yap
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 mx-auto text-gray-400 mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Rezervasyon Bulunamadı</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === "all" 
                  ? "Henüz hiç rezervasyonunuz bulunmuyor." 
                  : `${getStatusDetails(activeTab.toUpperCase()).label} durumunda rezervasyon bulunmuyor.`}
              </p>
              <Link 
                href="/hizmetler" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Hizmet Ara
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 