"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form validasyon şeması
const profileSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
    },
  });

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Bu sayfayı görüntülemek için giriş yapmalısınız");
      router.push("/giris");
      return;
    }

    // Kullanıcı bilgilerini form alanlarına doldur
    if (session?.user) {
      setValue("name", session.user.name || "");
      setValue("email", session.user.email || "");
      
      // Mock veri olarak telefon ve adres ekledik
      // Gerçek uygulamada bu bilgileri API'den alacaksınız
      setValue("phoneNumber", "0555 123 4567"); // Örnek
      setValue("address", "Atatürk Bulvarı No:123 Ankara"); // Örnek
    }
  }, [status, session, router, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      // Burada gerçek bir API çağrısı yapılacak
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Profil güncellenirken bir hata oluştu');
      // }

      // Simülasyon için gecikme ekleyelim
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // NextAuth oturumunu güncelle
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
        },
      });

      toast.success("Profil başarıyla güncellendi");
      router.push("/profil");
    } catch (error) {
      console.error("Profil güncellenirken hata oluştu:", error);
      toast.error("Profil güncellenirken bir hata oluştu");
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Profilimi Düzenle</h1>
          <Link 
            href="/profil" 
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; Profile Dön
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* İsim Alanı */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              İsim
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* E-posta Alanı */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Telefon Numarası Alanı */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon Numarası
            </label>
            <input
              id="phoneNumber"
              type="tel"
              {...register("phoneNumber")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="0555 123 4567"
              disabled={isLoading}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Adres Alanı */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Adres
            </label>
            <textarea
              id="address"
              {...register("address")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Adresinizi girin"
              disabled={isLoading}
            ></textarea>
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Düğmeler */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/profil"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 