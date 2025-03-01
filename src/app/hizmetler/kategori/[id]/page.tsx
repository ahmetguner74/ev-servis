"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Kategori tipi tanımı
type Category = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  parentId?: string | null;
};

// Hizmet tipi tanımı
type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // dakika cinsinden
  providerId: string;
  provider: {
    id: string;
    companyName?: string;
    userId: string;
    user: {
      name: string;
    };
  };
  categoryId: string;
  category: {
    id: string;
    name: string;
    icon?: string;
  };
  rating?: number;
  reviewCount?: number;
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>("popular");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  useEffect(() => {
    if (!categoryId) return;
    fetchCategoryAndServices();
  }, [categoryId]);

  // Kategori ve hizmetleri getir
  const fetchCategoryAndServices = async () => {
    setLoading(true);
    try {
      // Gerçek API'niz hazır olduğunda bu kısmı değiştirin
      // const categoryResponse = await fetch(`/api/categories/${categoryId}`);
      // const categoryData = await categoryResponse.json();
      // setCategory(categoryData);
      
      // const servicesResponse = await fetch(`/api/services?categoryId=${categoryId}`);
      // const servicesData = await servicesResponse.json();
      // setServices(servicesData);

      // Şimdilik mock data kullanıyoruz
      setTimeout(() => {
        // Mock kategori
        const mockCategories: Record<string, Category> = {
          "category-1": { id: "category-1", name: "Temizlik", description: "Ev ve ofis temizlik hizmetleri", icon: "🧹" },
          "category-2": { id: "category-2", name: "Tadilat", description: "Her türlü tamirat ve tadilat işleri", icon: "🔨" },
          "category-3": { id: "category-3", name: "Bahçe", description: "Bahçe düzenleme ve bakım", icon: "🌱" },
          "category-4": { id: "category-4", name: "Elektrik", description: "Elektrik tesisatı ve tadilatı", icon: "⚡" },
          "category-5": { id: "category-5", name: "Tesisatçı", description: "Su ve doğalgaz tesisatı", icon: "🔧" },
          "category-6": { id: "category-6", name: "Ev Temizliği", description: "Detaylı ev temizlik hizmetleri", icon: "🧽", parentId: "category-1" },
          "category-7": { id: "category-7", name: "Ofis Temizliği", description: "Ofis temizlik hizmetleri", icon: "🧼", parentId: "category-1" },
          "category-8": { id: "category-8", name: "Halı Yıkama", description: "Profesyonel halı yıkama hizmetleri", icon: "🧶", parentId: "category-1" },
          "category-9": { id: "category-9", name: "Boya", description: "İç ve dış cephe boya hizmetleri", icon: "🖌️", parentId: "category-2" },
          "category-10": { id: "category-10", name: "Mobilya Montaj", description: "Mobilya kurulum ve montaj", icon: "🪑", parentId: "category-2" }
        };

        const selectedCategory = mockCategories[categoryId];
        setCategory(selectedCategory || null);

        // Mock hizmetler - kategoriye göre filtrelenmiş
        const mockServices: Service[] = [];
        const serviceNames = [
          "Standart Temizlik", "Detaylı Temizlik", "Ofis Temizliği", "Halı Yıkama", 
          "Tadilat", "Boya", "Mobilya Montaj", "Elektrik Arıza", "Su Tesisatı", 
          "Bahçe Düzenleme", "Çim Biçme", "Peyzaj Düzenleme"
        ];
        
        const providerNames = [
          "Mavi Temizlik", "Yeşil Temizlik", "Aktif Tadilat", "Güven Tesisatçı", 
          "Uzman Elektrikçi", "Bahçıvan Ali", "Pro Hizmetler"
        ];

        // Kategoriye göre ilgili hizmetleri oluştur
        for (let i = 1; i <= 15; i++) {
          const nameIndex = Math.floor(Math.random() * serviceNames.length);
          const providerIndex = Math.floor(Math.random() * providerNames.length);
          const servicePrice = Math.floor(Math.random() * 500) + 100;  // 100-600 TL arası
          const serviceDuration = [60, 90, 120, 180, 240][Math.floor(Math.random() * 5)];  // 1-4 saat
          const serviceRating = (Math.random() * 3 + 2).toFixed(1);  // 2.0-5.0 arası
          const reviewCount = Math.floor(Math.random() * 100) + 1;  // 1-100 arası

          let matchingCategoryId = categoryId;
          // Eğer alt kategori seçildiyse, onun hizmetlerini görüntüle
          // Eğer ana kategori seçildiyse, hem kendi hem alt kategorilere ait hizmetlerini görüntüle
          const isParentCategory = Object.values(mockCategories).some(
            c => c.parentId === categoryId
          );
          
          const isChildCategory = selectedCategory?.parentId !== undefined;
          
          // Ana kategori ise, kendine ait ve alt kategorilere ait hizmetleri listele
          if (!isChildCategory) {
            const childCategoryIds = Object.values(mockCategories)
              .filter(c => c.parentId === categoryId)
              .map(c => c.id);
            
            // Her 3 hizmetten 2'si ana kategoriye, 1'i rastgele bir alt kategoriye ait olsun
            if (childCategoryIds.length > 0 && i % 3 !== 0) {
              matchingCategoryId = childCategoryIds[Math.floor(Math.random() * childCategoryIds.length)];
            }
          }

          // Sadece eşleşen kategorideki hizmetleri ekle
          if (
            matchingCategoryId === categoryId || 
            (isChildCategory && mockCategories[matchingCategoryId]?.parentId === selectedCategory?.parentId) ||
            (!isChildCategory && (mockCategories[matchingCategoryId]?.parentId === categoryId || matchingCategoryId === categoryId))
          ) {
            mockServices.push({
              id: `service-${i}`,
              name: `${serviceNames[nameIndex]} ${i}`,
              description: `Bu hizmet ${serviceNames[nameIndex].toLowerCase()} alanında profesyonel destek sağlar.`,
              price: servicePrice,
              duration: serviceDuration,
              providerId: `provider-${i}`,
              provider: {
                id: `provider-${i}`,
                companyName: providerNames[providerIndex],
                userId: `user-${i}`,
                user: {
                  name: `${providerNames[providerIndex]} Hizmetleri`
                }
              },
              categoryId: matchingCategoryId,
              category: {
                id: matchingCategoryId,
                name: mockCategories[matchingCategoryId]?.name || "",
                icon: mockCategories[matchingCategoryId]?.icon || ""
              },
              rating: parseFloat(serviceRating),
              reviewCount: reviewCount
            });
          }
        }

        setServices(mockServices);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Kategori ve hizmetleri getirirken hata oluştu:", error);
      setLoading(false);
    }
  };

  // Sıralama işlemi
  const sortedServices = [...services].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "popular":
      default:
        return (b.reviewCount || 0) - (a.reviewCount || 0);
    }
  });

  // Fiyat filtreleme
  const filteredServices = sortedServices.filter(service => {
    if (minPrice !== "" && service.price < minPrice) return false;
    if (maxPrice !== "" && service.price > maxPrice) return false;
    return true;
  });

  // Yıldız oluştur
  const renderStars = (rating: number = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
        {hasHalfStar && <span>★</span>}
        {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300">★</span>)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Kategori yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Kategori Bulunamadı</h1>
          <p className="text-gray-600 mb-8">İstediğiniz kategori bulunamadı veya artık mevcut değil.</p>
          <button 
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Kategori Başlık */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/" className="text-gray-500 hover:text-blue-600">Ana Sayfa</Link>
          <span className="text-gray-500">/</span>
          <Link href="#" onClick={() => router.back()} className="text-gray-500 hover:text-blue-600">Kategoriler</Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-700">{category.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{category.icon || "📁"}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 mt-1">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtreler */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Filtreler</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Fiyat Aralığı</h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Sıralama</h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="popular">Popülerlik</option>
                <option value="rating">Puanlama</option>
                <option value="price-low">Fiyat: Düşükten Yükseğe</option>
                <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
                setSortOption("popular");
              }}
              className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>

        {/* Hizmet Listesi */}
        <div className="lg:w-3/4">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold">{service.name}</h3>
                      <span className="text-2xl">{service.category.icon || "📁"}</span>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      {renderStars(service.rating)}
                      <span className="text-sm text-gray-500 ml-2">({service.reviewCount} yorum)</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{service.duration} dakika</span>
                      <span className="mx-2">•</span>
                      <span>{service.provider.companyName || service.provider.user.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold text-blue-600">{service.price} ₺</div>
                      <Link
                        href={`/hizmetler/${service.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Detaylar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Hizmet Bulunamadı</h3>
              <p className="text-gray-600 mb-4">Seçilen filtrelere uygun hizmet bulunamadı. Lütfen filtrelerinizi değiştirin veya daha sonra tekrar deneyin.</p>
              <button 
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  setSortOption("popular");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 