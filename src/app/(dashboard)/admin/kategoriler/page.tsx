"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Kategori tipi tanımı
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  parentId?: string;
  isPopular?: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  // Kategorileri getir
  useEffect(() => {
    fetchCategories();
  }, []);

  // Kategorileri getir
  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Simülasyon yapıyoruz - gerçek uygulamada API'ye istek yapılacak
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
          }
        ];
        setCategories(mockCategories);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
      toast.error("Kategoriler yüklenirken bir hata oluştu.");
      setLoading(false);
    }
  };

  // Kategori sil
  const handleDeleteCategory = async (categoryId: string) => {
    setDeleting(true);
    setDeletingCategoryId(categoryId);
    
    try {
      // Mock silme işlemi - gerçek uygulamada API'ye istek yapılacak
      setTimeout(() => {
        setCategories(prevCategories => 
          prevCategories.filter(category => category.id !== categoryId)
        );
        setDeleting(false);
        setDeletingCategoryId(null);
        toast.success("Kategori başarıyla silindi");
      }, 1000);
    } catch (error) {
      console.error("Kategori silinirken hata:", error);
      toast.error("Kategori silinirken bir hata oluştu.");
      setDeleting(false);
      setDeletingCategoryId(null);
    }
  };
  
  // Popüler durumu değiştir
  const handleTogglePopular = async (categoryId: string) => {
    try {
      // Mevcut kategoriyi bul ve isPopular değerini tersine çevir
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return { ...category, isPopular: !category.isPopular };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      
      // Başarı mesajını göster
      const category = updatedCategories.find(c => c.id === categoryId);
      if (category) {
        const message = category.isPopular 
          ? `"${category.name}" artık popüler kategoriler arasında` 
          : `"${category.name}" artık popüler kategoriler arasında değil`;
        toast.success(message);
      }
    } catch (error) {
      console.error("Popülerlik durumu değiştirilirken hata:", error);
      toast.error("İşlem sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Kategoriler</h1>
        <Link
          href="/admin/kategoriler/ekle"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Yeni Kategori Ekle
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Kategoriler Yükleniyor...</span>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İkon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori Adı
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Popüler
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                        {category.icon}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePopular(category.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          category.isPopular
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {category.isPopular ? 'Popüler ✓' : 'Popüler Değil'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          href={`/admin/kategoriler/${category.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Düzenle
                        </Link>
                        <Link
                          href={`/admin/kategoriler/${category.id}/adimlar`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Adımları Yönet
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={deleting}
                          className={`text-red-600 hover:text-red-900 ${deleting && deletingCategoryId === category.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {deleting && deletingCategoryId === category.id ? 'Siliniyor...' : 'Sil'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Henüz hiç kategori bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 