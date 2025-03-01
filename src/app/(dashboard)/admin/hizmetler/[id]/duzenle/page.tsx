"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Skeleton } from "@/app/components/ui/Skeleton";

// Form için validation şeması
const serviceFormSchema = z.object({
  name: z.string().min(3, "Hizmet adı en az 3 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  price: z.coerce.number().min(0, "Fiyat 0'dan küçük olamaz"),
  duration: z.coerce.number().min(1, "Süre en az 1 dakika olmalıdır"),
  categoryId: z.string().min(1, "Kategori seçimi zorunludur"),
  providerId: z.string().min(1, "Sağlayıcı seçimi zorunludur"),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

type Category = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
};

type Provider = {
  id: string;
  companyName?: string;
  userId: string;
  user: {
    name: string;
  };
};

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  providerId: string;
  categoryId: string;
  provider: {
    id: string;
    companyName?: string;
  };
  category: {
    id: string;
    name: string;
  };
};

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [service, setService] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 0,
      categoryId: "",
      providerId: "",
    },
  });

  useEffect(() => {
    // Kategorileri, sağlayıcıları ve hizmet bilgilerini yükle
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    setInitialLoading(true);
    try {
      await Promise.all([
        fetchCategories(),
        fetchProviders(),
        fetchServiceDetails()
      ]);
    } catch (error) {
      console.error("Veriler yüklenirken hata oluştu:", error);
      toast.error("Veriler yüklenirken bir hata oluştu");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Burada gerçek bir API çağrısı yapılacak
      // const response = await fetch('/api/admin/categories');
      // const data = await response.json();
      // setCategories(data);

      // Mock veriler
      return new Promise<void>(resolve => {
        setTimeout(() => {
          const mockCategories = [
            { id: "category-1", name: "Temizlik", description: "Ev ve ofis temizlik hizmetleri", icon: "🧹" },
            { id: "category-2", name: "Tadilat", description: "Her türlü tamirat ve tadilat işleri", icon: "🔨" },
            { id: "category-3", name: "Bahçe", description: "Bahçe düzenleme ve bakım", icon: "🌱" },
            { id: "category-4", name: "Elektrik", description: "Elektrik tesisatı ve tadilatı", icon: "⚡" },
            { id: "category-5", name: "Tesisatçı", description: "Su ve doğalgaz tesisatı", icon: "🔧" }
          ];
          setCategories(mockCategories);
          resolve();
        }, 500);
      });
    } catch (error) {
      console.error("Kategorileri yüklerken hata oluştu:", error);
      toast.error("Kategorileri yüklerken bir hata oluştu");
    }
  };

  const fetchProviders = async () => {
    try {
      // Burada gerçek bir API çağrısı yapılacak
      // const response = await fetch('/api/admin/providers');
      // const data = await response.json();
      // setProviders(data);

      // Mock veriler
      return new Promise<void>(resolve => {
        setTimeout(() => {
          const mockProviders = Array.from({ length: 5 }).map((_, index) => ({
            id: `provider-${index + 1}`,
            companyName: `Şirket ${index + 1}`,
            userId: `user-${index + 1}`,
            user: {
              name: `Sağlayıcı ${index + 1}`
            }
          }));
          setProviders(mockProviders);
          resolve();
        }, 500);
      });
    } catch (error) {
      console.error("Sağlayıcıları yüklerken hata oluştu:", error);
      toast.error("Sağlayıcıları yüklerken bir hata oluştu");
    }
  };

  const fetchServiceDetails = async () => {
    try {
      // Burada gerçek bir API çağrısı yapılacak
      // const response = await fetch(`/api/admin/services/${params.id}`);
      // if (!response.ok) {
      //   throw new Error('Hizmet bulunamadı');
      // }
      // const data = await response.json();
      // setService(data);
      // form verilerini ayarla

      // Mock veri
      return new Promise<void>(resolve => {
        setTimeout(() => {
          const categoryId = `category-${Math.floor(Math.random() * 5) + 1}`;
          const providerId = `provider-${Math.floor(Math.random() * 5) + 1}`;
          
          const mockService = {
            id: params.id,
            name: `Hizmet ${parseInt(params.id.split('-')[1])}`,
            description: `Bu ${parseInt(params.id.split('-')[1])} numaralı hizmet için detaylı açıklama. Bu hizmet kapsamında neler yapılacağı, hangi malzemelerin kullanılacağı ve ne kadar sürede tamamlanacağı hakkında bilgi içerir.`,
            price: Math.floor(Math.random() * 1000) + 100,
            duration: Math.floor(Math.random() * 120) + 30,
            providerId: providerId,
            categoryId: categoryId,
            provider: {
              id: providerId,
              companyName: `Şirket ${Math.floor(Math.random() * 5) + 1}`
            },
            category: {
              id: categoryId,
              name: ["Temizlik", "Tadilat", "Bahçe", "Elektrik", "Tesisatçı"][Math.floor(Math.random() * 5)]
            }
          };
          
          setService(mockService);
          
          // Form alanlarını doldur
          setValue("name", mockService.name);
          setValue("description", mockService.description);
          setValue("price", mockService.price);
          setValue("duration", mockService.duration);
          setValue("categoryId", mockService.categoryId);
          setValue("providerId", mockService.providerId);
          
          resolve();
        }, 1000);
      });
    } catch (error) {
      console.error("Hizmet detayları yüklenirken hata oluştu:", error);
      toast.error("Hizmet detayları yüklenirken bir hata oluştu");
      router.push("/admin/hizmetler");
    }
  };

  const onSubmit = async (data: ServiceFormValues) => {
    setLoading(true);
    try {
      // API'ye hizmet güncelleme isteği gönderilecek
      // const response = await fetch(`/api/admin/services/${params.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Hizmet güncellenirken bir hata oluştu');
      // }

      // Simülasyon
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Hizmet başarıyla güncellendi");
      router.push(`/admin/hizmetler/${params.id}`);
    } catch (error) {
      console.error("Hizmet güncellenirken hata oluştu:", error);
      toast.error("Hizmet güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full md:col-span-2" />
              <Skeleton className="h-40 w-full md:col-span-2" />
            </div>
            <div className="flex justify-end space-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hizmet Düzenle</h1>
        <Link
          href={`/admin/hizmetler/${params.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; Hizmet Detaylarına Dön
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hizmet Adı */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Hizmet Adı
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hizmet adını girin"
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Kategori */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                id="categoryId"
                {...register("categoryId")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Fiyat */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat (₺)
              </label>
              <input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={loading}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Süre */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Süre (dakika)
              </label>
              <input
                id="duration"
                type="number"
                {...register("duration", { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="60"
                min="1"
                disabled={loading}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.duration.message}
                </p>
              )}
            </div>

            {/* Sağlayıcı */}
            <div className="md:col-span-2">
              <label htmlFor="providerId" className="block text-sm font-medium text-gray-700 mb-1">
                Hizmet Sağlayıcı
              </label>
              <select
                id="providerId"
                {...register("providerId")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="">Sağlayıcı Seçin</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.companyName || provider.user.name}
                  </option>
                ))}
              </select>
              {errors.providerId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.providerId.message}
                </p>
              )}
            </div>

            {/* Açıklama */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hizmet açıklamasını girin"
                disabled={loading}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href={`/admin/hizmetler/${params.id}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 