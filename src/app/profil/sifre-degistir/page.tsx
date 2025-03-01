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
const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Mevcut şifreniz en az 6 karakter olmalıdır"),
    newPassword: z.string().min(6, "Yeni şifreniz en az 6 karakter olmalıdır"),
    confirmPassword: z.string().min(6, "Şifre onayı en az 6 karakter olmalıdır"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Yeni şifreniz mevcut şifrenizle aynı olamaz",
    path: ["newPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Bu sayfayı görüntülemek için giriş yapmalısınız");
      router.push("/giris");
      return;
    }
  }, [status, router]);

  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // Burada gerçek bir API çağrısı yapılacak
      // const response = await fetch('/api/user/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     currentPassword: data.currentPassword,
      //     newPassword: data.newPassword,
      //   }),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Şifre değiştirme işlemi başarısız oldu');
      // }

      // Simülasyon için gecikme ekleyelim
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Başarılı işlem
      toast.success("Şifreniz başarıyla değiştirildi");
      reset();
      router.push("/profil");
    } catch (error) {
      console.error("Şifre değiştirme hatası:", error);
      const errorMessage = error instanceof Error ? error.message : "Şifre değiştirme işlemi başarısız oldu";
      toast.error(errorMessage);
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
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Şifre Değiştir</h1>
          <Link 
            href="/profil" 
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; Profile Dön
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Mevcut Şifre */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Mevcut Şifre
            </label>
            <input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* Yeni Şifre */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Yeni Şifre
            </label>
            <input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Şifre Onayı */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Şifre Onayı
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Güvenlik İpuçları */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Güvenlik İpuçları:</h3>
            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-5">
              <li>En az 8 karakter kullanın</li>
              <li>Büyük ve küçük harfler, sayılar ve özel karakterler içersin</li>
              <li>Kişisel bilgilerinizi (doğum tarihi, isim) şifrenizde kullanmayın</li>
              <li>Farklı hesaplar için aynı şifreyi kullanmayın</li>
            </ul>
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
              {isLoading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 