"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/components/ui/Card";
import { Skeleton } from "@/app/components/ui/Skeleton";

// Placeholder İstatistik Tipi
type Stats = {
  totalUsers: number;
  totalProviders: number;
  totalServices: number;
  totalBookings: number;
  pendingProviders: number;
  pendingBookings: number;
  completedBookings: number;
  totalCategories: number;
  totalReviews: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerçek uygulamada API'dan verileri alacağız
    // Şimdilik verileri simüle edelim
    const fetchStats = async () => {
      try {
        // Placeholder veriler - gerçek API entegrasyonu için bu kısım güncellenmelidir
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        
        // Simüle edilmiş veriler
        const data = {
          totalUsers: 125,
          totalProviders: 48,
          totalServices: 186,
          totalBookings: 312,
          pendingProviders: 15,
          pendingBookings: 28,
          completedBookings: 245,
          totalCategories: 12,
          totalReviews: 156
        };
        
        setStats(data);
      } catch (error) {
        console.error("İstatistikler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    // Veri yüklemesini başlat
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Yönetici Paneli</h1>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Toplam Kullanıcı"
          value={stats?.totalUsers}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="blue"
          loading={loading}
        />
        
        <StatCard
          title="Toplam Sağlayıcı"
          value={stats?.totalProviders}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          color="green"
          loading={loading}
        />
        
        <StatCard
          title="Toplam Hizmet"
          value={stats?.totalServices}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="purple"
          loading={loading}
        />
        
        <StatCard
          title="Toplam Rezervasyon"
          value={stats?.totalBookings}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="yellow"
          loading={loading}
        />
      </div>

      {/* Detaylı İstatistikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onay Bekleyen */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Onay Bekleyenler</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Onay Bekleyen Sağlayıcılar</span>
              </div>
              {loading ? (
                <Skeleton className="w-12 h-6" />
              ) : (
                <span className="text-xl font-semibold">{stats?.pendingProviders}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Bekleyen Rezervasyonlar</span>
              </div>
              {loading ? (
                <Skeleton className="w-12 h-6" />
              ) : (
                <span className="text-xl font-semibold">{stats?.pendingBookings}</span>
              )}
            </div>
          </div>
        </div>

        {/* Ek İstatistikler */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Platform İstatistikleri</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Tamamlanan Rezervasyonlar</span>
              </div>
              {loading ? (
                <Skeleton className="w-12 h-6" />
              ) : (
                <span className="text-xl font-semibold">{stats?.completedBookings}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span>Toplam Kategoriler</span>
              </div>
              {loading ? (
                <Skeleton className="w-12 h-6" />
              ) : (
                <span className="text-xl font-semibold">{stats?.totalCategories}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <span>Toplam Değerlendirmeler</span>
              </div>
              {loading ? (
                <Skeleton className="w-12 h-6" />
              ) : (
                <span className="text-xl font-semibold">{stats?.totalReviews}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// İstatistik Kartı Bileşeni
interface StatCardProps {
  title: string;
  value?: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "yellow" | "red";
  loading: boolean;
}

function StatCard({ title, value, icon, color, loading }: StatCardProps) {
  // Renk sınıflarını belirle
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {loading ? (
            <Skeleton className="w-16 h-7 mt-1" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
} 