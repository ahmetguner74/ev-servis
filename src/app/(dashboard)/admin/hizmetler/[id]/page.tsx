"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/Card";

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  providerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  provider: {
    id: string;
    companyName: string;
    userId: string;
    user: {
      name: string;
      email: string;
    };
  };
  category: {
    id: string;
    name: string;
    icon?: string;
  };
};

export default function ServiceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceDetails();
  }, [params.id]);

  const fetchServiceDetails = async () => {
    setLoading(true);
    try {
      // Burada gerçek bir API çağrısı yapılacak
      // const response = await fetch(`/api/admin/services/${params.id}`);
      // if (!response.ok) {
      //   throw new Error('Hizmet bulunamadı');
      // }
      // const data = await response.json();
      // setService(data);

      // Mock veri
      setTimeout(() => {
        const mockService = {
          id: params.id,
          name: `Hizmet ${parseInt(params.id.split('-')[1])}`,
          description: `Bu ${parseInt(params.id.split('-')[1])} numaralı hizmet için detaylı açıklama. Bu hizmet kapsamında neler yapılacağı, hangi malzemelerin kullanılacağı ve ne kadar sürede tamamlanacağı hakkında bilgi içerir.`,
          price: Math.floor(Math.random() * 1000) + 100,
          duration: Math.floor(Math.random() * 120) + 30,
          providerId: `provider-${Math.floor(Math.random() * 5) + 1}`,
          categoryId: `category-${Math.floor(Math.random() * 5) + 1}`,
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
          provider: {
            id: `provider-${Math.floor(Math.random() * 5) + 1}`,
            companyName: `Şirket ${Math.floor(Math.random() * 5) + 1}`,
            userId: `user-${Math.floor(Math.random() * 5) + 1}`,
            user: {
              name: `Sağlayıcı ${Math.floor(Math.random() * 5) + 1}`,
              email: `saglayici${Math.floor(Math.random() * 5) + 1}@ornek.com`
            }
          },
          category: {
            id: `category-${Math.floor(Math.random() * 5) + 1}`,
            name: ["Temizlik", "Tadilat", "Bahçe", "Elektrik", "Tesisatçı"][Math.floor(Math.random() * 5)],
            icon: ["🧹", "🔨", "🌱", "⚡", "🔧"][Math.floor(Math.random() * 5)]
          }
        };
        setService(mockService);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Hizmet detayları yüklenirken hata oluştu:", error);
      toast.error("Hizmet detayları yüklenirken bir hata oluştu");
      setLoading(false);
    }
  };

  const handleDeleteService = async () => {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      // Burada gerçek bir API çağrısı yapılacak
      // await fetch(`/api/admin/services/${params.id}`, {
      //   method: 'DELETE'
      // });
      
      // Simülasyon
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Hizmet başarıyla silindi");
      router.push("/admin/hizmetler");
    } catch (error) {
      console.error("Hizmet silinirken hata oluştu:", error);
      toast.error("Hizmet silinirken bir hata oluştu");
    }
  };

  // Tarih formatlama fonksiyonu
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {loading ? <Skeleton className="h-8 w-64" /> : service?.name}
        </h1>
        <div className="flex space-x-4">
          <Link
            href="/admin/hizmetler"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Hizmetlere Dön
          </Link>
          {!loading && service && (
            <>
              <Link
                href={`/admin/hizmetler/${params.id}/duzenle`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Düzenle
              </Link>
              <button
                onClick={handleDeleteService}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Sil
              </button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ) : service ? (
        <div className="space-y-6">
          {/* Hizmet Detayları */}
          <Card>
            <CardHeader>
              <CardTitle>Hizmet Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Kategori</h3>
                  <div className="flex items-center mt-1">
                    <span className="mr-2">{service.category.icon}</span>
                    <span className="text-lg">{service.category.name}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fiyat</h3>
                  <p className="text-lg font-semibold">{service.price}₺</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Süre</h3>
                  <p className="text-lg">{service.duration} dakika</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Oluşturulma</h3>
                  <p className="text-sm">{formatDate(service.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Son Güncelleme</h3>
                  <p className="text-sm">{formatDate(service.updatedAt)}</p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium text-gray-500">Açıklama</h3>
                <p className="mt-1 text-gray-900">{service.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Sağlayıcı Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Sağlayıcı Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Sağlayıcı Adı</h3>
                  <p className="text-lg font-semibold">{service.provider.companyName || service.provider.user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">İletişim</h3>
                  <p className="text-sm">{service.provider.user.email}</p>
                </div>
                <div className="md:col-span-2">
                  <Link
                    href={`/admin/saglayicilar/${service.provider.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Sağlayıcı Detaylarını Görüntüle
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aksiyon Butonları */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/admin/hizmetler/${params.id}/duzenle`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Düzenle
            </Link>
            <button
              onClick={handleDeleteService}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Sil
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Hizmet bulunamadı. Silinmiş veya taşınmış olabilir.
        </div>
      )}
    </div>
  );
} 