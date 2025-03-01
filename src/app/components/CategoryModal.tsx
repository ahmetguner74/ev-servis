"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ServiceWizard from "./ServiceWizard";

// Kategori tipi tanımı
type Category = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  parentId?: string | null;
  isPopular?: boolean;
  children?: Category[];
};

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedCategoryDetails, setSelectedCategoryDetails] = useState<Category | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    } else {
      // Modal kapandığında seçimi temizle
      setSelectedCategory(null);
      setShowWizard(false);
    }
  }, [isOpen]);

  // Modal dışına tıklandığında kapat
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Kategorileri getir
  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Admin panelindeki kategorileri getiren aynı mock veriyi kullanıyoruz
      // İleride burası gerçek API çağrısı ile değiştirilecek
      // Gerçek implementasyon:
      // const response = await fetch('/api/admin/categories');
      // const data = await response.json();
      // if (data.success) {
      //   setCategories(data.categories);
      // } else {
      //   throw new Error(data.message || 'Kategoriler yüklenirken bir hata oluştu');
      // }
      
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
            isPopular: false
          },
          {
            id: "3", 
            name: "Tesisat",
            description: "Su, elektrik ve doğalgaz tesisatı kurulum ve tamir",
            icon: "🔧",
            isPopular: false
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
          },
          {
            id: "6",
            name: "Mobilya Montaj",
            description: "Mobilya kurulum ve montaj hizmetleri",
            icon: "🪑",
            isPopular: false
          },
          {
            id: "7",
            name: "Bahçe Bakımı",
            description: "Bahçe düzenleme ve bakım hizmetleri",
            icon: "🌱",
            isPopular: false
          },
          {
            id: "8",
            name: "Elektrik",
            description: "Elektrik tesisatı ve tamir hizmetleri",
            icon: "⚡",
            isPopular: false
          }
        ];
        setCategories(mockCategories);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Kategorileri getirirken hata oluştu:", error);
      setLoading(false);
    }
  };

  // Kategori seçimi
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    
    if (categoryId !== selectedCategory) {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        setSelectedCategoryDetails(category);
      }
    } else {
      setSelectedCategoryDetails(null);
    }
  };

  // Devam et butonu
  const handleContinue = () => {
    if (!selectedCategory || !selectedCategoryDetails) return;
    
    // Boya kategorisi için wizard formunu başlat
    if (selectedCategoryDetails.name === "Boya") {
      setShowWizard(true);
    } else {
      // Diğer kategoriler için kategori sayfasına yönlendir
      router.push(`/hizmetler/kategori/${selectedCategory}`);
      onClose();
    }
  };

  // Wizard kapatıldığında
  const handleWizardClose = () => {
    setShowWizard(false);
    onClose();
  };

  // Arama filtresi uygula
  const filteredCategories = searchTerm
    ? categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : categories;

  if (!isOpen) return null;
  
  // Wizard gösteriliyorsa
  if (showWizard && selectedCategoryDetails) {
    return (
      <ServiceWizard 
        isOpen={true} 
        onClose={handleWizardClose} 
        categoryId={selectedCategory as string} 
        categoryName={selectedCategoryDetails.name}
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 brush-container"
      onClick={handleBackdropClick}
      style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}
    >
      {/* Animasyonlu boya fırçası darbeleri */}
      <div className="brush-stroke brush-stroke-1" style={{"--rotation": "-15deg", background: "rgba(255,255,255,0.03)"} as React.CSSProperties}></div>
      <div className="brush-stroke brush-stroke-3" style={{"--rotation": "10deg", background: "rgba(255,255,255,0.03)"} as React.CSSProperties}></div>
      
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden relative z-[110]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Hizmet Seçin</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            aria-label="Kapat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Arama kutusu */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Hizmet ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 pl-12 bg-gray-50"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-4 top-3.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 font-medium">Yükleniyor...</span>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[50vh] mb-6 pr-2 -mr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`flex items-center p-4 rounded-xl text-left transition-all ${
                        selectedCategory === category.id 
                          ? 'bg-blue-50 border-2 border-blue-500 shadow-md transform scale-[1.02]' 
                          : 'hover:bg-gray-50 border border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4 transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {category.icon || "📁"}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${selectedCategory === category.id ? 'text-blue-600' : 'text-gray-900'}`}>
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{category.description}</p>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 px-4 bg-gray-50 rounded-xl text-gray-500">
                    Arama sonucu bulunamadı. Lütfen farklı bir arama terimi deneyin.
                  </div>
                )}
              </div>
            </div>
          )}
          
          <button
            onClick={handleContinue}
            disabled={!selectedCategory}
            className={`w-full py-4 rounded-xl font-medium transition-all ${
              selectedCategory 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedCategory ? 'Devam Et' : 'Lütfen bir hizmet seçin'}
          </button>
        </div>
      </div>
    </div>
  );
} 