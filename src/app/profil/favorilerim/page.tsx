"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/Card";
import { Skeleton } from "@/app/components/ui/Skeleton";

// Favori hizmet tipi tanımı
type FavoriteService = {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  providerId: string;
  providerName: string;
  price: number;
  category: string;
  rating: number;
  ratingCount: number;
  addedAt: string;
};

export default function MyFavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteService[]>([]);

  // Sahte favori verileri oluşturan yardımcı fonksiyon
  const generateMockFavorites = () => {
    const serviceNames = [
      'Ev Temizliği', 'Klima Bakımı', 'Boya İşleri', 'Tadilat', 
      'Bahçe Düzenleme', 'Mobilya Montajı', 'Elektrik Tamiratı', 'Su Tesisatı'
    ];
    
    const providerNames = [
      'Ahmet Temizlik', 'Mehmet Teknik Servis', 'Ayşe Dekorasyon', 
      'Ali Tadilat', 'Fatma Bahçecilik', 'Mustafa Montaj'
    ];
    
    const categories = [
      'Temizlik', 'Bakım', 'Tadilat', 'Bahçe', 'Montaj', 'Elektrik', 'Su Tesisatı'
    ];

    const mockFavorites: FavoriteService[] = [];
    
    // Rastgele 0-10 arası favori oluştur
    const favoriteCount = Math.floor(Math.random() * 11);
    
    for (let i = 0; i < favoriteCount; i++) {
      const randomServiceName = serviceNames[Math.floor(Math.random() * serviceNames.length)];
      const randomProviderName = providerNames[Math.floor(Math.random() * providerNames.length)];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomRating = Math.random() * 2 + 3; // 3-5 arası puanlar
      
      // Rastgele bir tarih (son 90 gün içinde)
      const today = new Date();
      const favoriteDate = new Date(today);
      favoriteDate.setDate(today.getDate() - Math.floor(Math.random() * 90));
      
      mockFavorites.push({
        id: `fav-${i + 1}`,
        serviceId: `srv-${Math.floor(Math.random() * 100)}`,
        serviceName: randomServiceName,
        serviceImage: `/images/services/${i % 5 + 1}.jpg`,
        providerId: `prov-${Math.floor(Math.random() * 100)}`,
        providerName: randomProviderName,
        price: Math.floor(Math.random() * 900) + 100,
        category: randomCategory,
        rating: randomRating,
        ratingCount: Math.floor(Math.random() * 50) + 5,
        addedAt: favoriteDate.toISOString(),
      });
    }
    
    // Tarihe göre sırala - en yeni en üstte
    return mockFavorites.sort((a, b) => 
      new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Bu sayfayı görüntülemek için giriş yapmalısınız");
      router.push("/giris");
      return;
    }

    // Gerçek bir uygulamada API'den favorileri çekeceğiz
    // fetchFavorites();
    
    // Test için sahte veri
    setTimeout(() => {
      setFavorites(generateMockFavorites());
      setLoading(false);
    }, 1000);
  }, [status, router]);

  // Favorilerden çıkarma fonksiyonu
  const removeFavorite = (id: string) => {
    // Gerçek bir uygulamada API çağrısı yapılır
    // API çağrısını simüle edelim
    setLoading(true);
    setTimeout(() => {
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
      setLoading(false);
      toast.success("Hizmet favorilerden çıkarıldı");
    }, 800);
  };

  // Yıldız ratingini göster
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)} ({favorites.find(f => f.id === favorites[0]?.id)?.ratingCount || 0})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Favorilerim</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <div className="relative pb-1/2 h-48">
                <Skeleton className="absolute inset-0 w-full h-full" />
              </div>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Favorilerim</h1>
        <Link 
          href="/profil" 
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Profile Dön
        </Link>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={favorite.serviceImage || "/images/placeholder.jpg"} 
                  alt={favorite.serviceName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
                <div 
                  onClick={() => removeFavorite(favorite.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow cursor-pointer hover:bg-red-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-3">
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-500 bg-opacity-90 rounded">
                    {favorite.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1 line-clamp-1">{favorite.serviceName}</h3>
                <p className="text-gray-600 text-sm mb-2">Sağlayıcı: {favorite.providerName}</p>
                
                <div className="flex justify-between items-center mb-3">
                  {renderStarRating(favorite.rating)}
                  <span className="font-semibold text-green-600">{favorite.price} ₺</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Favorilere eklendi: {new Date(favorite.addedAt).toLocaleDateString('tr-TR')}
                  </span>
                  <Link 
                    href={`/hizmetler/${favorite.serviceId}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Detaylar
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Favori Hizmetiniz Yok</h3>
              <p className="text-gray-500 mb-6">
                Beğendiğiniz hizmetleri favorilere ekleyerek daha sonra kolayca erişebilirsiniz.
              </p>
              <Link 
                href="/hizmetler" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Hizmetleri Keşfet
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 