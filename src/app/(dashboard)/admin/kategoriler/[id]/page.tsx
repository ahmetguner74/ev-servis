"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Kategori tipi
type Category = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  parentId?: string | null;
};

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    parentId: ""
  });
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    fetchCategoryDetails();
  }, [categoryId]);
  
  // Kategori detaylarını getir
  const fetchCategoryDetails = async () => {
    setLoading(true);
    try {
      // Gerçek API'niz hazır olduğunda bu kısmı değiştirin
      // const response = await fetch(`/api/admin/categories/${categoryId}`);
      // const data = await response.json();
      // setCategory(data);
      // setFormData({
      //   name: data.name || "",
      //   description: data.description || "",
      //   icon: data.icon || "",
      //   parentId: data.parentId || ""
      // });
      
      // Şimdilik mock data kullanıyoruz
      setTimeout(() => {
        const mockCategories: Category[] = [
          { id: "category-1", name: "Temizlik", description: "Ev ve ofis temizlik hizmetleri", icon: "🧹" },
          { id: "category-2", name: "Tadilat", description: "Her türlü tamirat ve tadilat işleri", icon: "🔨" },
          { id: "category-3", name: "Bahçe", description: "Bahçe düzenleme ve bakım", icon: "🌱" },
          { id: "category-4", name: "Elektrik", description: "Elektrik tesisatı ve tadilatı", icon: "⚡" },
          { id: "category-5", name: "Tesisatçı", description: "Su ve doğalgaz tesisatı", icon: "🔧" },
          { id: "category-6", name: "Ev Temizliği", description: "Detaylı ev temizlik hizmetleri", icon: "🧽", parentId: "category-1" },
          { id: "category-7", name: "Ofis Temizliği", description: "Ofis temizlik hizmetleri", icon: "🧼", parentId: "category-1" },
          { id: "category-8", name: "Halı Yıkama", description: "Profesyonel halı yıkama hizmetleri", icon: "🧶", parentId: "category-1" },
          { id: "category-9", name: "Boya", description: "İç ve dış cephe boya hizmetleri", icon: "🎨" },
        ];
        
        // Seçilen kategori
        const selectedCategory = mockCategories.find(c => c.id === categoryId);
        
        if (selectedCategory) {
          setCategory(selectedCategory);
          setFormData({
            name: selectedCategory.name || "",
            description: selectedCategory.description || "",
            icon: selectedCategory.icon || "",
            parentId: selectedCategory.parentId || ""
          });
          
          // Potansiyel üst kategoriler (kendisi hariç)
          setParentCategories(mockCategories.filter(c => c.id !== categoryId && !c.parentId));
        } else {
          toast.error("Kategori bulunamadı!");
          router.push("/admin/kategoriler");
        }
        
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Kategori detayları getirme hatası:", error);
      toast.error("Kategori detayları yüklenirken bir hata oluştu.");
      setLoading(false);
    }
  };
  
  // Form değişikliklerini izle
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Formu kaydet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaving(true);
    
    try {
      // Gerçek API'niz hazır olduğunda bu kısmı değiştirin
      // await fetch(`/api/admin/categories/${categoryId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // Şimdilik kaydetme işlemini simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Kategori nesnesini güncelle
      if (category) {
        const updatedCategory: Category = {
          ...category,
          name: formData.name,
          description: formData.description || null,
          icon: formData.icon || null,
          parentId: formData.parentId || null
        };
        
        setCategory(updatedCategory);
      }
      
      toast.success("Kategori başarıyla güncellendi.");
    } catch (error) {
      console.error("Kategori güncelleme hatası:", error);
      toast.error("Kategori güncellenirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };
  
  const emoji = [
    "📁", "🧹", "🔨", "🌱", "⚡", "🔧", "🧽", "🧼", "🧶", "🎨", "🏠", "🚿", "🚽", "🛁", "🪑", "📺", "🖌️", "🔌"
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link 
              href="/admin/kategoriler" 
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-sm">Kategoriler</span>
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-sm text-gray-700">{category?.name || 'Kategori Detayı'}</span>
          </div>
          <h1 className="text-2xl font-bold">{category ? `${category.name} Kategorisi` : 'Kategori Detayı'}</h1>
        </div>
        
        <div className="flex gap-3">
          <Link
            href={`/admin/kategoriler`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Tüm Kategoriler
          </Link>
          <Link
            href={`/admin/kategoriler/${categoryId}/adimlar`}
            className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700"
          >
            Adımları Yönet
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Kategori Detayları Yükleniyor...</span>
        </div>
      ) : category ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  İkon
                </label>
                <div className="grid grid-cols-9 gap-2 mb-2">
                  {emoji.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon: em }))}
                      className={`text-2xl p-2 border rounded-lg hover:bg-gray-100 ${
                        formData.icon === em ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Emoji veya ikon kodu"
                />
              </div>
              
              <div>
                <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Üst Kategori
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Ana Kategori (Üst kategori yok)</option>
                  {parentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <Link
                  href="/admin/kategoriler"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 ${
                    saving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Kaydediliyor...</span>
                    </div>
                  ) : (
                    "Kaydet"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500">Kategori bulunamadı.</p>
        </div>
      )}
      
      {/* Önizleme bölümü */}
      {category && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Kategori Önizleme</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{formData.icon || '📁'}</span>
                <div>
                  <h3 className="text-lg font-semibold">{formData.name}</h3>
                  {formData.description && (
                    <p className="text-sm text-gray-500">{formData.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Link 
                  href={`/admin/kategoriler/${categoryId}/adimlar`}
                  className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  Adımları Yönet
                </Link>
                
                <Link 
                  href={`/admin/kategoriler/${categoryId}/onizleme`}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  Kullanıcı Önizlemesi
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 