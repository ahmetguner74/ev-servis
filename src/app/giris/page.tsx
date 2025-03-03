"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { supabase } from "@/app/lib/supabase";
import { useSupabase } from "@/app/auth/SupabaseProvider";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function GirisPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { user, session } = useSupabase();

  useEffect(() => {
    // Kullanıcı oturum açmışsa ana sayfaya yönlendir
    if (user) {
      toast.success("Zaten giriş yapmışsınız!");
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-10 lg:px-20 py-16">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
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

  return (
    <div className="flex min-h-screen">
      {/* Sol kısım - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-10 lg:px-20 py-16">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold mb-6">Giriş Yap</h1>
          <p className="text-gray-600 mb-8">
            Hoş geldiniz! Devam etmek için hesabınıza giriş yapın.
          </p>

          {/* Supabase Auth UI */}
          <div className="mb-8">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="default"
              providers={['google', 'github']}
              redirectTo={`${window.location.origin}/auth/callback`}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'E-posta adresiniz',
                    password_label: 'Şifreniz',
                    button_label: 'Giriş Yap',
                    loading_button_label: 'Giriş yapılıyor...',
                    social_provider_text: '{{provider}} ile devam et',
                    link_text: 'Zaten hesabınız var mı? Giriş yapın'
                  },
                  sign_up: {
                    email_label: 'E-posta adresiniz',
                    password_label: 'Şifreniz',
                    button_label: 'Kayıt Ol',
                    loading_button_label: 'Kayıt olunuyor...',
                    social_provider_text: '{{provider}} ile kayıt ol',
                    link_text: 'Hesabınız yok mu? Kayıt olun'
                  },
                }
              }}
            />
          </div>

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