"use client";

import { useState, useEffect } from "react";
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
  provider: {
    id: string;
    companyName: string;
    userId: string;
    user: {
      name: string;
    };
  };
  category: {
    id: string;
    name: string;
    icon?: string;
  };
};

type Category = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, price, newest
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const itemsPerPage = 10;

  useEffect(() => {
    // Verileri yükle
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    // Gerçek API entegrasyonu yapılana kadar mock verilerle çalışacağız
    setLoading(true);
    try {
      // Burada gerçek bir API çağrısı yapılacak
      // const response = await fetch('/api/admin/services');
      // const data = await response.json();
      // setServices(data);

      // Mock veriler
      setTimeout(() => {
        const mockServices = Array.from({ length: 25 }).map((_, index) => ({
          id: `service-${index + 1}`,
          name: `Hizmet ${index + 1}`,
          description: `Bu ${index + 1} numaralı hizmet açıklamasıdır.`,
          price: Math.floor(Math.random() * 1000) + 100,
          duration: Math.floor(Math.random() * 120) + 30,
          providerId: `provider-${Math.floor(Math.random() * 5) + 1}`,
          categoryId: `category-${Math.floor(Math.random() * 5) + 1}`,
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          provider: {
            id: `provider-${Math.floor(Math.random() * 5) + 1}`,
            companyName: `Şirket ${Math.floor(Math.random() * 5) + 1}`,
            userId: `user-${Math.floor(Math.random() * 5) + 1}`,
            user: {
              name: `Sağlayıcı ${Math.floor(Math.random() * 5) + 1}`
            }
          },
          category: {
            id: `category-${Math.floor(Math.random() * 5) + 1}`,
            name: ["Temizlik", "Tadilat", "Bahçe", "Elektrik", "Tesisatçı"][Math.floor(Math.random() * 5)],
            icon: "🔧"
          }
        }));
        setServices(mockServices);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Hizmetleri yüklerken hata oluştu:", error);
      toast.error("Hizmetleri yüklerken bir hata oluştu");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Burada gerçek bir API çağrısı yapılacak
      // const response = await fetch('/api/admin/categories');
      // const data = await response.json();
      // setCategories(data);

      // Mock veriler
      setTimeout(() => {
        const mockCategories = [
          { id: "category-1", name: "Temizlik", description: "Ev ve ofis temizlik hizmetleri", icon: "🧹" },
          { id: "category-2", name: "Tadilat", description: "Her türlü tamirat ve tadilat işleri", icon: "🔨" },
          { id: "category-3", name: "Bahçe", description: "Bahçe düzenleme ve bakım", icon: "🌱" },
          { id: "category-4", name: "Elektrik", description: "Elektrik tesisatı ve tadilatı", icon: "⚡" },
          { id: "category-5", name: "Tesisatçı", description: "Su ve doğalgaz tesisatı", icon: "🔧" }
        ];
        setCategories(mockCategories);
      }, 500);
    } catch (error) {
      console.error("Kategorileri yüklerken hata oluştu:", error);
      toast.error("Kategorileri yüklerken bir hata oluştu");
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      // Burada gerçek bir API çağrısı yapılacak
      // await fetch(`/api/admin/services/${serviceId}`, {
      //   method: 'DELETE'
      // });

      // Kullanıcı arayüzünü güncelle
      setServices(services.filter(service => service.id !== serviceId));
      toast.success("Hizmet başarıyla silindi");
    } catch (error) {
      console.error("Hizmet silinirken hata oluştu:", error);
      toast.error("Hizmet silinirken bir hata oluştu");
    }
  };

  // Filtreleme ve Arama
  const filteredServices = services.filter(service => {
    return (
      (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       service.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || service.category.id === selectedCategory)
    );
  });

  // Sıralama
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === "price") {
      return sortOrder === "asc" 
        ? a.price - b.price
        : b.price - a.price;
    } else if (sortBy === "newest") {
      return sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  // Sayfalama
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const paginatedServices = sortedServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hizmet Yönetimi</h1>
        <Link 
          href="/admin/hizmetler/ekle" 
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Yeni Hizmet Ekle
        </Link>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Hizmet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : services.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Fiyat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : 
                services.length > 0 
                  ? `${Math.round(services.reduce((sum, service) => sum + service.price, 0) / services.length)}₺` 
                  : "0₺"
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Süre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : 
                services.length > 0 
                  ? `${Math.round(services.reduce((sum, service) => sum + service.duration, 0) / services.length)} dk` 
                  : "0 dk"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col md:flex-row gap-4 pb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Hizmet ara..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
          >
            <option value="name-asc">İsim (A-Z)</option>
            <option value="name-desc">İsim (Z-A)</option>
            <option value="price-asc">Fiyat (Artan)</option>
            <option value="price-desc">Fiyat (Azalan)</option>
            <option value="newest-desc">En Yeni</option>
            <option value="newest-asc">En Eski</option>
          </select>
        </div>
      </div>

      {/* Hizmet Tablosu */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hizmet Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Süre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sağlayıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Gösterilecek hizmet bulunamadı
                    </td>
                  </tr>
                ) : (
                  paginatedServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {service.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{service.category.icon}</span>
                          <span>{service.category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.price}₺</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.duration} dk</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {service.provider.companyName || service.provider.user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/hizmetler/${service.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Görüntüle
                          </Link>
                          <Link
                            href={`/admin/hizmetler/${service.id}/duzenle`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Düzenle
                          </Link>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{currentPage}</span> / <span>{totalPages}</span> sayfa
                (Toplam <span className="font-medium">{filteredServices.length}</span> hizmet)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md bg-white text-gray-700 disabled:opacity-50"
                >
                  Önceki
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md bg-white text-gray-700 disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 