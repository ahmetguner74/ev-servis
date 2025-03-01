"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { WizardStep, CategoryFlow } from "../../../../components/ServiceWizard";

// Kategori tipi
type Category = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  parentId?: string | null;
};

export default function CategoryPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [flow, setFlow] = useState<CategoryFlow | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<WizardStep | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [finalStep, setFinalStep] = useState(false);
  
  useEffect(() => {
    fetchCategoryAndFlow();
  }, [categoryId]);
  
  // Kategori ve akış verilerini getir
  const fetchCategoryAndFlow = async () => {
    setLoading(true);
    try {
      // Gerçek API'niz hazır olduğunda bu kısmı değiştirin
      // Burada kategori ve akış bilgilerini API'den alabilirsiniz
      
      // Şimdilik mock data kullanıyoruz
      setTimeout(() => {
        // Mock kategori
        const mockCategory: Category = {
          id: categoryId,
          name: "Boya",
          description: "İç ve dış cephe boya hizmetleri",
          icon: "🖌️"
        };
        
        // Mock akış (Boya kategorisi için)
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
              nextStep: "step-2"
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
              nextStep: "step-3"
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
              ]
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
              nextStep: "step-5"
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
              nextStep: "step-6"
            },
            {
              id: "step-6",
              title: "Başlama Tarihi",
              question: "Boya işinin yapılmasını istediğiniz tarih?",
              type: "date",
              required: true,
              nextStep: "step-7"
            },
            {
              id: "step-7",
              title: "Ek Notlar",
              question: "Boya işiyle ilgili eklemek istediğiniz başka detay var mı?",
              type: "textarea",
              required: false,
              placeholder: "Özel isteklerinizi buraya yazabilirsiniz...",
              nextStep: "step-8"
            },
            {
              id: "step-8",
              title: "Adres",
              question: "Hizmetin verileceği adres nedir?",
              type: "address",
              required: true,
              nextStep: "step-9"
            },
            {
              id: "step-9",
              title: "İletişim Bilgileri",
              question: "Size nasıl ulaşabiliriz?",
              type: "text", // Özel bir tip olarak düşünebiliriz
              required: true,
              nextStep: null
            }
          ]
        };
        
        setCategory(mockCategory);
        setFlow(mockFlow);
        setCurrentStepId(mockFlow.initialStepId);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Kategori ve akış bilgilerini getirme hatası:", error);
      toast.error("Veri yüklenirken bir hata oluştu.");
      setLoading(false);
    }
  };
  
  // Mevcut adımı ayarla
  useEffect(() => {
    if (flow && currentStepId) {
      const step = flow.steps.find(s => s.id === currentStepId);
      if (step) {
        setCurrentStep(step);
        setFinalStep(step.nextStep === null);
      }
    }
  }, [flow, currentStepId]);
  
  // Bir sonraki adıma git
  const goToNextStep = () => {
    if (!currentStep || !flow) return;
    
    // Mevcut adımda koşullu bir sonraki adım var mı?
    if (currentStep.conditionalNextStep && currentStep.conditionalNextStep.length > 0) {
      const selectedOption = formData[currentStep.id];
      const conditionalNext = currentStep.conditionalNextStep.find(
        c => c.optionId === selectedOption
      );
      
      if (conditionalNext) {
        setCurrentStepId(conditionalNext.nextStepId);
        return;
      }
    }
    
    // Normal sonraki adım
    if (currentStep.nextStep) {
      setCurrentStepId(currentStep.nextStep);
    } else {
      // Form tamamlandı - önizleme olduğu için sadece toast gösteriyoruz
      toast.success("Form tamamlandı! Bu bir önizlemedir.");
    }
  };
  
  // Bir önceki adıma git
  const goToPreviousStep = () => {
    if (!flow || !currentStepId) return;
    
    // Mevcut adımın indeksini bul
    const currentIndex = flow.steps.findIndex(s => s.id === currentStepId);
    if (currentIndex > 0) {
      setCurrentStepId(flow.steps[currentIndex - 1].id);
    }
  };
  
  // Form değişimi handle et
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (!currentStep) return;
    
    // Form verilerini güncelle
    setFormData(prev => ({
      ...prev,
      [currentStep.id]: value
    }));
  };
  
  // Radio/Checkbox seçimi
  const handleOptionSelect = (optionId: string) => {
    if (!currentStep) return;
    
    setFormData(prev => ({
      ...prev,
      [currentStep.id]: optionId
    }));
  };
  
  // Mevcut adımda kullanıcının bir seçim yapıp yapmadığını kontrol et
  const isStepValid = () => {
    if (!currentStep) return false;
    
    // Son adımda önizleme olduğu için her zaman geçerli kabul ediyoruz
    if (finalStep) return true;
    
    // Adım zorunlu değilse geçerli kabul et
    if (!currentStep.required) return true;
    
    // Diğer adımlarda ilgili veri var mı kontrol et
    return formData[currentStep.id] !== undefined && formData[currentStep.id] !== '';
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
            <Link 
              href={`/admin/kategoriler/${categoryId}`}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-sm">{category?.name || 'Kategori'}</span>
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-sm text-gray-700">Önizleme</span>
          </div>
          <h1 className="text-2xl font-bold">{category ? `${category.name} Kategorisi Önizleme` : 'Kategori Önizleme'}</h1>
        </div>
        
        <div className="flex gap-3">
          <Link
            href={`/admin/kategoriler/${categoryId}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Kategori Detayları
          </Link>
          <Link
            href={`/admin/kategoriler/${categoryId}/adimlar`}
            className="px-4 py-2 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700"
          >
            Adımları Yönet
          </Link>
        </div>
      </div>
      
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Yükleniyor...</span>
          </div>
        ) : (
          <>
            {/* Başlık */}
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{category?.name}</h2>
                {currentStep && <p className="text-sm text-gray-500">{currentStep.title}</p>}
              </div>
            </div>
            
            {/* İçerik */}
            <div className="p-4">
              {currentStep ? (
                <div className="py-2">
                  {/* Adım Göstergesi */}
                  {flow && (
                    <div className="mb-6">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          Adım {flow.steps.findIndex(s => s.id === currentStepId) + 1} / {flow.steps.length}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {Math.round(((flow.steps.findIndex(s => s.id === currentStepId) + 1) / flow.steps.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ width: `${((flow.steps.findIndex(s => s.id === currentStepId) + 1) / flow.steps.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Soru */}
                  <h3 className="text-lg font-medium mb-4">{currentStep.question}</h3>
                  
                  {/* Form Alanları */}
                  <div className="mb-6">
                    {finalStep ? (
                      // Son adım - İletişim bilgileri
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Ad Soyad*
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder="Adınız ve soyadınız"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            E-posta Adresi*
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder="ornek@email.com"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Telefon Numarası*
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder="05XX XXX XX XX"
                          />
                        </div>
                        <div className="pt-2">
                          <p className="text-xs text-gray-500">
                            * işaretli alanlar zorunludur. İletişim bilgileriniz gizli tutulacak ve sadece sizinle iletişime geçmek için kullanılacaktır.
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Diğer adımlar - İçerik tipine göre
                      <>
                        {currentStep.type === "radio" && currentStep.options && (
                          <div className="space-y-2">
                            {currentStep.options.map(option => (
                              <div 
                                key={option.id}
                                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                  formData[currentStep.id] === option.id
                                    ? 'bg-green-50 border-green-500'
                                    : 'hover:bg-gray-50 border-gray-200'
                                }`}
                                onClick={() => handleOptionSelect(option.id)}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                    formData[currentStep.id] === option.id
                                      ? 'border-green-500'
                                      : 'border-gray-300'
                                  }`}>
                                    {formData[currentStep.id] === option.id && (
                                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <span>{option.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {currentStep.type === "checkbox" && currentStep.options && (
                          <div className="space-y-2">
                            {currentStep.options.map(option => (
                              <div 
                                key={option.id}
                                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                  formData[currentStep.id] === option.id
                                    ? 'bg-green-50 border-green-500'
                                    : 'hover:bg-gray-50 border-gray-200'
                                }`}
                                onClick={() => handleOptionSelect(option.id)}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                                    formData[currentStep.id] === option.id
                                      ? 'border-green-500 bg-green-500'
                                      : 'border-gray-300'
                                  }`}>
                                    {formData[currentStep.id] === option.id && (
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                                      </svg>
                                    )}
                                  </div>
                                  <span>{option.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {currentStep.type === "select" && currentStep.options && (
                          <select
                            value={formData[currentStep.id] || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, [currentStep.id]: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="" disabled>Seçiniz</option>
                            {currentStep.options.map(option => (
                              <option key={option.id} value={option.id}>{option.label}</option>
                            ))}
                          </select>
                        )}
                        
                        {currentStep.type === "text" && (
                          <input
                            type="text"
                            value={formData[currentStep.id] || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, [currentStep.id]: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder={currentStep.placeholder}
                          />
                        )}
                        
                        {currentStep.type === "textarea" && (
                          <textarea
                            value={formData[currentStep.id] || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, [currentStep.id]: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder={currentStep.placeholder}
                            rows={4}
                          />
                        )}
                        
                        {currentStep.type === "date" && (
                          <input
                            type="date"
                            value={formData[currentStep.id] || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, [currentStep.id]: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                          />
                        )}
                        
                        {currentStep.type === "time" && (
                          <input
                            type="time"
                            value={formData[currentStep.id] || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, [currentStep.id]: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                          />
                        )}
                        
                        {currentStep.type === "address" && (
                          <textarea
                            value={formData[currentStep.id] || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, [currentStep.id]: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder="Tam adresinizi giriniz"
                            rows={3}
                          />
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Düğmeler */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      disabled={flow?.steps.findIndex(s => s.id === currentStepId) === 0}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Geri
                    </button>
                    <button
                      type="button"
                      onClick={goToNextStep}
                      disabled={!isStepValid()}
                      className={`px-6 py-2 rounded-md font-medium text-white ${
                        isStepValid()
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {finalStep ? (
                        "Talebi Gönder"
                      ) : (
                        "Devam Et"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="mt-6 max-w-xl mx-auto bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Önizleme Modu</h3>
            <div className="mt-1 text-sm text-blue-700">
              <p>Bu bir önizleme modudur. Gerçek bir form gönderimi yapılmayacaktır.</p>
              <p className="mt-1">Bu sayfayı kullanarak kategorinizin talep adımlarını test edebilirsiniz.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 