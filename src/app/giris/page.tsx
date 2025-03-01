"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function GirisPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Giriş yapılamadı. E-posta veya şifre hatalı.");
      } else {
        toast.success("Giriş başarılı!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sol kısım - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-10 lg:px-20 py-16">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold mb-6">Giriş Yap</h1>
          <p className="text-gray-600 mb-8">
            Hoş geldiniz! Devam etmek için hesabınıza giriş yapın.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link href="/sifremi-unuttum" className="font-medium text-blue-600 hover:text-blue-500">
                  Şifremi unuttum
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{" "}
              <Link href="/kayit" className="font-medium text-blue-600 hover:text-blue-500">
                Hemen Kaydolun
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Sağ kısım - Görsel */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-600">
        <div className="h-full w-full flex items-center justify-center p-12">
          <div className="max-w-xl text-white">
            <h2 className="text-3xl font-bold mb-6">Ev Hizmetleriniz İçin En İyi Çözüm</h2>
            <p className="text-lg opacity-90 mb-8">
              Platformumuz sayesinde ihtiyacınız olan tüm ev hizmetlerine kolayca ulaşabilir,
              güvenilir uzmanlarla çalışabilirsiniz.
            </p>
            <div className="flex space-x-3 opacity-90">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              <span className="ml-2">Binlerce memnun müşteri</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 