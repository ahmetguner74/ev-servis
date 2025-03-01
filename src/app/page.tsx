"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryModal from "./components/CategoryModal";

// Kategori tipi tanımı
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  parentId?: string;
  isPopular?: boolean;
}

export default function Home() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [popularCategories, setPopularCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Popüler kategorileri getir 
  useEffect(() => {
    const fetchPopularCategories = async () => {
      setLoading(true);
      try {
        // Normalde bir API isteği yapılır, şimdilik mock veri kullanıyoruz
        setTimeout(() => {
          const mockCategories: Category[] = [
            {
              id: "1",
              name: "Boya",
              description: "Evinizin iç ve dış boyası için profesyonel hizmet",
              icon: "🎨",
              isPopular: true
            },
            {
              id: "2",
              name: "Tadilat",
              description: "Her türlü ev tadilat ve renovasyon işleri",
              icon: "🔨",
              isPopular: true
            },
            {
              id: "3",
              name: "Tesisat",
              description: "Su, elektrik ve doğalgaz tesisatı kurulum ve tamir",
              icon: "🔧",
              isPopular: true
            },
            {
              id: "4",
              name: "Temizlik",
              description: "Eviniz için kapsamlı temizlik hizmetleri",
              icon: "🧹",
              isPopular: true
            },
            {
              id: "5",
              name: "Nakliyat",
              description: "Ev ve ofis taşıma hizmetleri",
              icon: "🚚",
              isPopular: true
            }
          ];
          
          // Sadece isPopular=true olan kategorilerden ilk 3'ünü seçiyoruz
          setPopularCategories(mockCategories.filter(cat => cat.isPopular).slice(0, 3));
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Popüler kategoriler yüklenirken hata:", error);
        setLoading(false);
      }
    };
    
    fetchPopularCategories();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 md:py-28 brush-container">
        {/* Animasyonlu boya fırçası darbeleri */}
        <div className="brush-stroke brush-stroke-1" style={{"--rotation": "-15deg"} as React.CSSProperties}></div>
        <div className="brush-stroke brush-stroke-2" style={{"--rotation": "25deg"} as React.CSSProperties}></div>
        <div className="brush-stroke brush-stroke-3" style={{"--rotation": "-10deg"} as React.CSSProperties}></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Eviniz İçin <span className="text-blue-600">Profesyonel</span> Hizmetler
              </h1>
              <p className="text-lg text-gray-600 mb-8 md:pr-10">
                Uzman ekiplerimizle evinizin tüm ihtiyaçlarını karşılıyoruz. Güvenilir, hızlı ve kaliteli hizmet için hemen başvurun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
                >
                  Ücretsiz Teklif Al
                </button>
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl transform md:rotate-2 transition-transform hover:rotate-0 duration-300">
              <Image
                src="/images/home-services.jpg" 
                alt="Profesyonel Ev Hizmetleri" 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40">
                <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
                  style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}}
                ></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popüler Hizmetler Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              POPÜLER HİZMETLER
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              En Çok Tercih Edilen Hizmetlerimiz
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kaliteli ve güvenilir profesyonellerle evinizin tüm ihtiyaçlarını karşılayın.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularCategories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/hizmetler/kategori/${category.id}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hizmet Nasıl Çalışır */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50 brush-container">
        {/* Animasyonlu boya fırçası darbeleri */}
        <div className="brush-stroke brush-stroke-1" style={{"--rotation": "5deg"} as React.CSSProperties}></div>
        <div className="brush-stroke brush-stroke-3" style={{"--rotation": "-5deg"} as React.CSSProperties}></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              NASIL ÇALIŞIR
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sadece Üç Adımda Hizmet Alın
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profesyonel ekiplerimizden hizmet almanın ne kadar kolay olduğunu keşfedin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl text-center shadow-lg transition-transform hover:-translate-y-2 duration-300">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 font-bold text-2xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Hizmet Seçin</h3>
              <p className="text-gray-600">
                İhtiyacınız olan hizmeti seçin ve birkaç basit soruyu yanıtlayın.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl text-center shadow-lg transition-transform hover:-translate-y-2 duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 font-bold text-2xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Teklif Alın</h3>
              <p className="text-gray-600">
                Bölgenizdeki uzman servis sağlayıcılarından hızlıca teklif alın.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl text-center shadow-lg transition-transform hover:-translate-y-2 duration-300">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600 font-bold text-2xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Hizmeti Alın</h3>
              <p className="text-gray-600">
                Size en uygun teklifi seçin ve randevu oluşturun. Bu kadar basit!
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Müşteri Yorumları */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
              MÜŞTERİ YORUMLARI
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hizmetlerimizle ilgili deneyimlerini paylaşan müşterilerimizin yorumları.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-blue-200 rounded-full mr-4 overflow-hidden flex items-center justify-center">
                  <span className="text-2xl">👩</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Ayşe Y.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Ev boyama hizmetiniz gerçekten profesyoneldi. Ekip zamanında geldi ve işi çok temiz bıraktı. Kesinlikle tavsiye ederim."
              </p>
            </div>
            
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-green-200 rounded-full mr-4 overflow-hidden flex items-center justify-center">
                  <span className="text-2xl">👨</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Mehmet K.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Mutfak tadilatı için aldığım hizmet beklentilerimin üstündeydi. Kaliteli malzemeler ve işçilik için teşekkürler."
              </p>
            </div>
            
            <div className="bg-amber-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-amber-200 rounded-full mr-4 overflow-hidden flex items-center justify-center">
                  <span className="text-2xl">👩‍🦰</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Zeynep A.</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Su tesisatı sorunumuzu çok hızlı çözdünüz. Uygun fiyata kaliteli hizmet aldım, teşekkür ederim."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Bölümü */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white brush-container">
        {/* Animasyonlu boya fırçası darbeleri */}
        <div className="brush-stroke brush-stroke-2" style={{"--rotation": "15deg", background: "rgba(255,255,255,0.1)"} as React.CSSProperties}></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hemen Hizmet Almaya Başlayın
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
            Ev hizmetleri için profesyonel destek almak hiç bu kadar kolay olmamıştı. Formu doldurun, size ulaşalım.
          </p>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
          >
            Ücretsiz Teklif Al
          </button>
        </div>
      </section>
      
      {/* Kategori Modal */}
      <CategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
      />
    </main>
  );
}

