"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import StepEditModal from "../../../../../components/StepEditModal";

// Kategori adımı tipi
type Step = {
  id: string;
  title: string;
  question: string;
  type: "radio" | "checkbox" | "text" | "textarea" | "select" | "date" | "time" | "address";
  options?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  required?: boolean;
  placeholder?: string;
  nextStep?: string | null; // Bir sonraki adımın ID'si veya null ise formun sonu
  conditionalNextStep?: Array<{
    optionId: string;
    nextStepId: string;
  }>;
  order: number;
};

// Kategori akışı tipi
type CategoryFlow = {
  id: string;
  categoryId: string;
  steps: Step[];
  initialStepId: string;
};

// Kategori tipi
type Category = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
};

export default function CategoryStepsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [flow, setFlow] = useState<CategoryFlow | null>(null);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [isNewStep, setIsNewStep] = useState(false);
  
  // Kategori ve adım verilerini getir
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gerçek API'niz hazır olduğunda bu kısmı değiştirin
        // const categoryResponse = await fetch(`/api/admin/categories/${categoryId}`);
        // const categoryData = await categoryResponse.json();
        // setCategory(categoryData);
        
        // const flowResponse = await fetch(`/api/admin/category-flow/${categoryId}`);
        // const flowData = await flowResponse.json();
        // setFlow(flowData);
        // setSteps(flowData.steps.sort((a, b) => a.order - b.order));
        
        // Şimdilik mock data kullanıyoruz
        setTimeout(() => {
          // Mock kategori
          const mockCategory: Category = {
            id: categoryId,
            name: "Boya",
            description: "İç ve dış cephe boya hizmetleri",
            icon: "🖌️"
          };
          
          // Mock akış
          const mockFlow: CategoryFlow = {
            id: "flow-1",
            categoryId: categoryId,
            initialStepId: "step-1",
            steps: [
              {
                id: "step-1",
                title: "Boya Türü",
                question: "Evinizde hangi boya işini yaptırmak istiyorsunuz?",
                type: "radio",
                required: true,
                options: [
                  { id: "opt-1", label: "İç cephe boyası", value: "ic-cephe" },
                  { id: "opt-2", label: "Dış cephe boyası", value: "dis-cephe" },
                  { id: "opt-3", label: "Her ikisi de", value: "ic-dis-cephe" }
                ],
                nextStep: "step-2",
                order: 1
              },
              {
                id: "step-2",
                title: "Metrekare",
                question: "Boyanacak alan yaklaşık kaç metrekare?",
                type: "radio",
                required: true,
                options: [
                  { id: "opt-4", label: "50 m² veya daha az", value: "50-or-less" },
                  { id: "opt-5", label: "51-100 m²", value: "51-100" },
                  { id: "opt-6", label: "101-150 m²", value: "101-150" },
                  { id: "opt-7", label: "151-200 m²", value: "151-200" },
                  { id: "opt-8", label: "201 m² veya daha fazla", value: "201-or-more" }
                ],
                nextStep: "step-3",
                order: 2
              },
              {
                id: "step-3",
                title: "Boya Markası",
                question: "Tercih ettiğiniz boya markası var mı?",
                type: "radio",
                required: true,
                options: [
                  { id: "opt-9", label: "Evet", value: "yes" },
                  { id: "opt-10", label: "Hayır, ustanın önerdiği marka olabilir", value: "no" }
                ],
                conditionalNextStep: [
                  { optionId: "opt-9", nextStepId: "step-4" },
                  { optionId: "opt-10", nextStepId: "step-5" }
                ],
                order: 3
              },
              {
                id: "step-4",
                title: "Marka Seçimi",
                question: "Hangi boya markasını tercih ediyorsunuz?",
                type: "select",
                required: true,
                options: [
                  { id: "opt-11", label: "Filli Boya", value: "filli-boya" },
                  { id: "opt-12", label: "Dyo", value: "dyo" },
                  { id: "opt-13", label: "Marshall", value: "marshall" },
                  { id: "opt-14", label: "Polisan", value: "polisan" },
                  { id: "opt-15", label: "Casati", value: "casati" },
                  { id: "opt-16", label: "Diğer", value: "other" }
                ],
                nextStep: "step-5",
                order: 4
              },
              {
                id: "step-5",
                title: "Tavan Boyası",
                question: "Tavan boyası yapılacak mı?",
                type: "radio",
                required: true,
                options: [
                  { id: "opt-17", label: "Evet", value: "yes" },
                  { id: "opt-18", label: "Hayır", value: "no" }
                ],
                nextStep: "step-6",
                order: 5
              },
              {
                id: "step-6",
                title: "Başlama Tarihi",
                question: "Boya işinin yapılmasını istediğiniz tarih?",
                type: "date",
                required: true,
                nextStep: "step-7",
                order: 6
              },
              {
                id: "step-7",
                title: "Ek Notlar",
                question: "Boya işiyle ilgili eklemek istediğiniz başka detay var mı?",
                type: "textarea",
                required: false,
                placeholder: "Özel isteklerinizi buraya yazabilirsiniz...",
                nextStep: "step-8",
                order: 7
              },
              {
                id: "step-8",
                title: "Adres",
                question: "Hizmetin verileceği adres nedir?",
                type: "address",
                required: true,
                nextStep: "step-9",
                order: 8
              },
              {
                id: "step-9",
                title: "İletişim Bilgileri",
                question: "Size nasıl ulaşabiliriz?",
                type: "text",
                required: true,
                nextStep: null,
                order: 9
              }
            ]
          };
          
          setCategory(mockCategory);
          setFlow(mockFlow);
          setSteps(mockFlow.steps.sort((a, b) => a.order - b.order));
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Veri getirme hatası:", error);
        toast.error("Veriler yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categoryId]);
  
  // Adım sil
  const handleDeleteStep = async (stepId: string) => {
    if (!confirm("Bu adımı silmek istediğinizden emin misiniz?")) return;
    
    setDeleting(true);
    
    try {
      // Gerçek API'niz hazır olduğunda bu kısmı değiştirin
      // await fetch(`/api/admin/steps/${stepId}`, {
      //   method: 'DELETE',
      // });
      
      // Şimdilik silme işlemini simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Adımı state'den kaldır
      setSteps(prev => prev.filter(step => step.id !== stepId));
      
      // Adım sıralarını güncelle
      const updatedSteps = steps
        .filter(step => step.id !== stepId)
        .map((step, index) => ({
          ...step,
          order: index + 1
        }));
      
      setSteps(updatedSteps);
      toast.success("Adım başarıyla silindi.");
    } catch (error) {
      console.error("Adım silme hatası:", error);
      toast.error("Adım silinirken bir hata oluştu.");
    } finally {
      setDeleting(false);
    }
  };
  
  // Adım sırasını değiştir
  const handleReorderStep = async (stepId: string, direction: "up" | "down") => {
    const currentIndex = steps.findIndex(step => step.id === stepId);
    
    if (
      (direction === "up" && currentIndex === 0) || 
      (direction === "down" && currentIndex === steps.length - 1)
    ) {
      return;
    }
    
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    
    // Sıraları güncelle
    const updatedSteps = [...steps];
    
    // Seçilen adımın sıra numarasını geçici olarak değiştir
    const temp = updatedSteps[currentIndex].order;
    updatedSteps[currentIndex].order = updatedSteps[targetIndex].order;
    updatedSteps[targetIndex].order = temp;
    
    // Dizini sırala
    updatedSteps.sort((a, b) => a.order - b.order);
    
    setReordering(true);
    
    try {
      // Gerçek API'niz hazır olduğunda bu kısmı değiştirin
      // await fetch(`/api/admin/category-flow/${flow.id}/reorder`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ steps: updatedSteps }),
      // });
      
      // Şimdilik güncelleme işlemini simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSteps(updatedSteps);
      toast.success("Adım sırası güncellendi.");
    } catch (error) {
      console.error("Sıralama hatası:", error);
      toast.error("Adım sırası güncellenirken bir hata oluştu.");
    } finally {
      setReordering(false);
    }
  };
  
  // Adım düzenleme modalını aç
  const openEditModal = (step: Step) => {
    setCurrentStep(step);
    setIsNewStep(false);
    setIsModalOpen(true);
  };

  // Yeni adım ekleme modalını aç
  const openNewStepModal = () => {
    const newStep: Step = {
      id: `step-${Date.now()}`,
      title: "",
      question: "",
      type: "radio",
      required: true,
      order: steps.length + 1
    };
    
    setCurrentStep(newStep);
    setIsNewStep(true);
    setIsModalOpen(true);
  };

  // Adım kaydet
  const handleSaveStep = (step: Step) => {
    try {
      if (isNewStep) {
        // Yeni adım ekle
        const updatedSteps = [...steps, step];
        setSteps(updatedSteps);
        
        // Akışı güncelle
        if (flow) {
          const updatedFlow = { ...flow };
          updatedFlow.steps = updatedSteps;
          
          // Eğer ilk adım eklendiyse, initialStepId'yi ayarla
          if (updatedSteps.length === 1) {
            updatedFlow.initialStepId = step.id;
          }
          
          setFlow(updatedFlow);
        }
      } else {
        // Mevcut adımı güncelle
        const updatedSteps = steps.map(s => s.id === step.id ? step : s);
        setSteps(updatedSteps);
        
        // Akışı güncelle
        if (flow) {
          const updatedFlow = { ...flow };
          updatedFlow.steps = updatedSteps;
          setFlow(updatedFlow);
        }
      }
    } catch (error) {
      console.error("Adım kaydedilirken hata:", error);
      toast.error("Adım kaydedilirken bir hata oluştu.");
    }
  };

  // Adım preview
  const getStepPreview = (step: Step) => {
    // Adımın tipine göre içeriğini önizle
    switch (step.type) {
      case "radio":
      case "checkbox":
      case "select":
        return step.options && step.options.length > 0 
          ? step.options.slice(0, 3).map(opt => opt.label).join(", ") + (step.options.length > 3 ? "..." : "")
          : "Seçenek yok";
      case "text":
        return "Kısa metin girişi";
      case "textarea":
        return "Uzun metin girişi";
      case "date":
        return "Tarih seçimi";
      case "time":
        return "Saat seçimi";
      case "address":
        return "Adres girişi";
      default:
        return "-";
    }
  };

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
            {category && (
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            )}
            <span className="text-gray-500">/</span>
            <span className="text-sm text-gray-700">Talep Adımları</span>
          </div>
          <h1 className="text-2xl font-bold">{category ? `${category.name} Kategori Adımları` : 'Kategori Adımları'}</h1>
        </div>
        
        <div className="flex gap-3">
          <Link
            href={`/admin/kategoriler/${categoryId}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Kategori Detayları
          </Link>
          <Link
            href={`/admin/kategoriler/${categoryId}/adimlar/ekle`}
            className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700"
          >
            Yeni Adım Ekle
          </Link>
        </div>
      </div>
      
      {/* Adım Düzenleme Modal */}
      <StepEditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        step={currentStep}
        allSteps={steps}
        onSave={handleSaveStep}
        isNew={isNewStep}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Adımlar Yükleniyor...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Form Adımları</h2>
            <button
              onClick={openNewStepModal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Yeni Adım Ekle
            </button>
          </div>
          
          {steps.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sıra
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Soru
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zorunlu
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {steps.map((step) => (
                  <tr key={step.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{step.order}</span>
                        <div>
                          <button
                            onClick={() => handleReorderStep(step.id, "up")}
                            disabled={step.order === 1 || reordering}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReorderStep(step.id, "down")}
                            disabled={step.order === steps.length || reordering}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{step.title}</div>
                      {flow?.initialStepId === step.id && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          Başlangıç Adımı
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{step.question}</div>
                      <div className="mt-1 text-xs text-gray-400">{getStepPreview(step)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {step.type === "radio" ? "Tekli Seçim" : 
                         step.type === "checkbox" ? "Çoklu Seçim" : 
                         step.type === "text" ? "Kısa Metin" : 
                         step.type === "textarea" ? "Uzun Metin" : 
                         step.type === "select" ? "Açılır Liste" : 
                         step.type === "date" ? "Tarih" : 
                         step.type === "time" ? "Saat" : 
                         step.type === "address" ? "Adres" : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {step.required ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Evet
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Hayır
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-3">
                      <button
                        onClick={() => openEditModal(step)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleReorderStep(step.id, "up")}
                        disabled={step.order === 1 || reordering}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleReorderStep(step.id, "down")}
                        disabled={step.order === steps.length || reordering}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteStep(step.id)}
                        disabled={deleting}
                        className={`text-red-600 hover:text-red-900 ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {deleting && editingStepId === step.id ? 'Siliniyor...' : 'Sil'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Henüz hiç adım eklenmemiş.</p>
              <button
                onClick={openNewStepModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                İlk Adımı Ekle
              </button>
            </div>
          )}
        </div>
      )}
      
      {!loading && steps.length > 0 && (
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            href={`/admin/kategoriler/${categoryId}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Kategori Detayları
          </Link>
          <Link
            href={`/admin/kategoriler/${categoryId}/onizleme`}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700"
          >
            Form Önizleme
          </Link>
        </div>
      )}
    </div>
  );
} 