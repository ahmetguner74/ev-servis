"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import axios from "axios";

const signupSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function KayitPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      // API endpoint henüz oluşturulmadı, şimdilik sadece simülasyon yapıyoruz
      // const response = await axios.post("/api/auth/register", {
      //   name: data.name,
      //   email: data.email,
      //   password: data.password,
      // });
      
      // Simülasyon: İşlem başarılı varsayıyoruz
      toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
      
      // Kullanıcıyı giriş sayfasına yönlendir
      setTimeout(() => {
        router.push("/giris");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sol kısım - Görsel */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-600">
        <div className="h-full w-full flex items-center justify-center p-12">
          <div className="max-w-xl text-white">
            <h2 className="text-3xl font-bold mb-6">Ev Hizmetleri Platformuna Hoş Geldiniz</h2>
            <p className="text-lg opacity-90 mb-8">
              Kayıt olarak güvenilir hizmet sağlayıcılarımızla tanışın ve ihtiyacınız olan hizmeti kolayca bulun.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Güvenilir hizmet sağlayıcılar</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Hızlı rezervasyon</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Kalite garantisi</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>7/24 destek</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ kısım - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-10 lg:px-20 py-16">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold mb-6">Hesap Oluştur</h1>
          <p className="text-gray-600 mb-8">
            Hemen kayıt olun ve tüm hizmetlerimizden yararlanmaya başlayın.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Adınız Soyadınız"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="adiniz@ornek.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="En az 6 karakter"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Şifrenizi tekrar girin"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                <span>
                  <Link href="/kullanim-kosullari" className="text-blue-600 hover:text-blue-500">
                    Kullanım Koşulları
                  </Link>
                  {" "}ve{" "}
                  <Link href="/gizlilik-politikasi" className="text-blue-600 hover:text-blue-500">
                    Gizlilik Politikası
                  </Link>
                  'nı kabul ediyorum
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Kayıt Yapılıyor..." : "Ücretsiz Kaydol"}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Zaten hesabınız var mı?{" "}
              <Link href="/giris" className="font-medium text-blue-600 hover:text-blue-500">
                Giriş Yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 