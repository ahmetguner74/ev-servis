"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/Card";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Bu sayfayı görüntülemek için giriş yapmalısınız");
      router.push("/giris");
      return;
    }

    setLoading(false);
    // Gerçek bir uygulamada burada rezervasyonları ve yorumları yükleyebilirsiniz
    // fetchReservations();
    // fetchReviews();
  }, [status, router]);

  if (loading) {
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
      <h1 className="text-3xl font-bold mb-8">Profilim</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol Sütun - Kullanıcı Bilgileri */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Hesap Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-500">
                  {session?.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || "Profil"} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-xl font-semibold">{session?.user?.name || "İsimsiz Kullanıcı"}</h2>
                <p className="text-gray-500">{session?.user?.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {session?.user?.role === "ADMIN" 
                      ? "Yönetici" 
                      : session?.user?.role === "PROVIDER" 
                        ? "Hizmet Sağlayıcı" 
                        : "Kullanıcı"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Link 
                    href="/profil/duzenle" 
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Profili Düzenle
                  </Link>
                </div>
                
                {session?.user?.role === "ADMIN" && (
                  <div>
                    <Link 
                      href="/admin" 
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Yönetici Paneline Git
                    </Link>
                  </div>
                )}
                
                {session?.user?.role === "PROVIDER" && (
                  <div>
                    <Link 
                      href="/saglayici/dashboard" 
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-green-600 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Sağlayıcı Paneline Git
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hesap Güvenliği Kartı */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Hesap Güvenliği</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link 
                  href="/profil/sifre-degistir" 
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Şifre Değiştir
                </Link>
                
                <Link 
                  href="/profil/bildirim-ayarlari" 
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Bildirim Ayarları
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Sütun - İçerik */}
        <div className="md:col-span-2 space-y-6">
          {/* Son Rezervasyonlar */}
          <Card>
            <CardHeader>
              <CardTitle>Son Rezervasyonlarım</CardTitle>
            </CardHeader>
            <CardContent>
              {reservations.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {/* Burada rezervasyonları listeleyin */}
                  <p className="py-4">Henüz rezervasyon bulunmuyor.</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Henüz hiç rezervasyonunuz bulunmuyor.</p>
                  <div className="space-y-2">
                    <Link 
                      href="/hizmetler" 
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Hizmet Ara
                    </Link>
                    <div className="mt-2">
                      <Link 
                        href="/profil/rezervasyonlarim" 
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Tüm Rezervasyonlarımı Görüntüle
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Favoriler */}
          <Card>
            <CardHeader>
              <CardTitle>Favorilerim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">Henüz favori hizmetiniz bulunmuyor.</p>
                <div className="space-y-2">
                  <Link 
                    href="/hizmetler" 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Hizmetleri Keşfet
                  </Link>
                  <div className="mt-2">
                    <Link 
                      href="/profil/favorilerim" 
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Tüm Favorilerimi Görüntüle
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yorumlarım */}
          <Card>
            <CardHeader>
              <CardTitle>Yorumlarım</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">Burada yaptığınız son yorumlar görüntülenir.</p>
                <Link 
                  href="/profil/yorumlarim" 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Tüm Yorumlarımı Görüntüle
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Admin için Özel Bilgiler */}
          {session?.user?.role === "ADMIN" && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Yönetici Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-800">
                        Yönetici olarak sisteme erişim sağlıyorsunuz.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-blue-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Hızlı Erişim</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        href="/admin/kullanicilar" 
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Kullanıcılar
                      </Link>
                      <Link 
                        href="/admin/hizmetler" 
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Hizmetler
                      </Link>
                      <Link 
                        href="/admin/rezervasyonlar" 
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Rezervasyonlar
                      </Link>
                      <Link 
                        href="/admin/saglayicilar" 
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Sağlayıcılar
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hizmet Sağlayıcı için Özel Bilgiler */}
          {session?.user?.role === "PROVIDER" && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Sağlayıcı Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Hizmet sağlayıcı olarak sisteme erişim sağlıyorsunuz.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-green-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Hızlı Erişim</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        href="/saglayici/hizmetlerim" 
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Hizmetlerim
                      </Link>
                      <Link 
                        href="/saglayici/rezervasyonlar" 
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Rezervasyonlar
                      </Link>
                      <Link 
                        href="/saglayici/takvim" 
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Uygunluk Takvimi
                      </Link>
                      <Link 
                        href="/saglayici/yorumlar" 
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Yorumlar
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Link 
          href="/profil/duzenle" 
          className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50"
        >
          <div className="mr-3 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Profil Düzenle</h3>
            <p className="text-sm text-gray-500">Kişisel bilgilerinizi güncelleyin</p>
          </div>
        </Link>
        
        <Link 
          href="/profil/sifre-degistir" 
          className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50"
        >
          <div className="mr-3 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Şifre Değiştir</h3>
            <p className="text-sm text-gray-500">Hesap güvenliğinizi yönetin</p>
          </div>
        </Link>
        
        <Link 
          href="/profil/bildirim-ayarlari" 
          className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50"
        >
          <div className="mr-3 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium">Bildirim Ayarları</h3>
            <p className="text-sm text-gray-500">Bildirim tercihlerinizi yönetin</p>
          </div>
        </Link>
      </div>
    </div>
  );
} 