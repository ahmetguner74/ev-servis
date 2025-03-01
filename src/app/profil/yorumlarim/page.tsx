"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/Card";
import { Skeleton } from "@/app/components/ui/Skeleton";

// Yorum tipi tanımı
type Review = {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  providerId: string;
  providerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string | null;
};

export default function MyReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Sahte yorum verileri oluşturan yardımcı fonksiyon
  const generateMockReviews = () => {
    const serviceNames = [
      'Ev Temizliği', 'Klima Bakımı', 'Boya İşleri', 'Tadilat', 
      'Bahçe Düzenleme', 'Mobilya Montajı', 'Elektrik Tamiratı', 'Su Tesisatı'
    ];
    
    const providerNames = [
      'Ahmet Temizlik', 'Mehmet Teknik Servis', 'Ayşe Dekorasyon', 
      'Ali Tadilat', 'Fatma Bahçecilik', 'Mustafa Montaj'
    ];
    
    const comments = [
      'Çok memnun kaldım, hizmet kalitesi mükemmeldi.',
      'Hızlı ve profesyonel bir hizmet aldım, teşekkürler.',
      'Zamanında geldiler ve işlerini düzgün yaptılar.',
      'Fiyat performans açısından gayet makul bir hizmet.',
      'İşini bilen profesyonel bir ekip, tekrar tercih edeceğim.',
      'Genel olarak memnun kaldım, bazı küçük eksikler vardı.',
      'Biraz geç kaldılar ama sonuç tatmin ediciydi.',
      'Temiz ve özenli çalıştılar, tavsiye ederim.'
    ];

    const mockReviews: Review[] = [];
    
    // Rastgele 0-8 arası yorum oluştur
    const reviewCount = Math.floor(Math.random() * 9);
    
    for (let i = 0; i < reviewCount; i++) {
      const randomServiceName = serviceNames[Math.floor(Math.random() * serviceNames.length)];
      const randomProviderName = providerNames[Math.floor(Math.random() * providerNames.length)];
      const randomComment = comments[Math.floor(Math.random() * comments.length)];
      const randomRating = Math.floor(Math.random() * 3) + 3; // 3-5 arası puanlar
      
      // Rastgele bir tarih (son 30 gün içinde)
      const today = new Date();
      const reviewDate = new Date(today);
      reviewDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
      
      // Rastgele olarak bazı yorumları güncellenmiş göster
      const isUpdated = Math.random() > 0.7;
      let updatedDate = null;
      
      if (isUpdated) {
        updatedDate = new Date(reviewDate);
        updatedDate.setDate(reviewDate.getDate() + Math.floor(Math.random() * 5) + 1);
      }
      
      mockReviews.push({
        id: `rev-${i + 1}`,
        serviceId: `srv-${Math.floor(Math.random() * 100)}`,
        serviceName: randomServiceName,
        serviceImage: `/images/services/${i % 5 + 1}.jpg`,
        providerId: `prov-${Math.floor(Math.random() * 100)}`,
        providerName: randomProviderName,
        rating: randomRating,
        comment: randomComment,
        createdAt: reviewDate.toISOString(),
        updatedAt: isUpdated ? updatedDate?.toISOString() : null,
      });
    }
    
    return mockReviews;
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Bu sayfayı görüntülemek için giriş yapmalısınız");
      router.push("/giris");
      return;
    }

    // Gerçek bir uygulamada API'den yorumları çekeceğiz
    // fetchReviews();
    
    // Test için sahte veri
    setTimeout(() => {
      setReviews(generateMockReviews());
      setLoading(false);
    }, 1000);
  }, [status, router]);

  // Yorumu düzenleme fonksiyonu
  const editReview = (reviewId: string) => {
    router.push(`/yorum-duzenle/${reviewId}`);
  };

  // Yorumu silme fonksiyonu
  const deleteReview = (reviewId: string) => {
    if (window.confirm("Bu yorumu silmek istediğinizden emin misiniz?")) {
      // Gerçek bir uygulamada API çağrısı yapılır
      // API çağrısını simüle edelim
      setLoading(true);
      setTimeout(() => {
        setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
        setLoading(false);
        toast.success("Yorum başarıyla silindi");
      }, 800);
    }
  };

  // Yıldız ratingini göster
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Yorumlarım</h1>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Skeleton className="h-20 w-20 rounded-md flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-16 w-full" />
                      <div className="flex gap-2 mt-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
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
        <h1 className="text-3xl font-bold">Yorumlarım</h1>
        <Link 
          href="/profil" 
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Profile Dön
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Değerlendirmelerim</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-20 h-20 bg-gray-200 rounded-md flex-shrink-0">
                        <img 
                          src={review.serviceImage || "/images/placeholder.jpg"} 
                          alt={review.serviceName}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{review.serviceName}</h3>
                            <p className="text-gray-600 text-sm">Sağlayıcı: {review.providerName}</p>
                            <div className="mt-1">
                              {renderStarRating(review.rating)}
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0 text-sm text-gray-500">
                            <time dateTime={review.createdAt}>
                              {new Date(review.createdAt).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                            {review.updatedAt && (
                              <span className="ml-2 text-xs">
                                (Düzenlendi: {new Date(review.updatedAt).toLocaleDateString('tr-TR')})
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 text-gray-700">
                          <p>{review.comment}</p>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => editReview(review.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
                          >
                            Düzenle
                          </button>
                          <button 
                            onClick={() => deleteReview(review.id)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                          >
                            Sil
                          </button>
                          <Link 
                            href={`/hizmetler/${review.serviceId}`}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm ml-auto"
                          >
                            Hizmeti Görüntüle
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Yorum Yapmadınız</h3>
              <p className="text-gray-500 mb-6">
                Aldığınız hizmetleri değerlendirerek diğer kullanıcılara yardımcı olabilirsiniz.
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