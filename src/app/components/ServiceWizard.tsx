"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import emailjs from '@emailjs/browser';

// Form adımı tipi
export type WizardStep = {
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
};

// Kategori talebi tipi
export type CategoryFlow = {
  id: string;
  categoryId: string;
  steps: WizardStep[];
  initialStepId: string;
};

// Wizard props
interface ServiceWizardProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string; // Seçilen kategori ID'si
  categoryName: string; // Kategori adı
}

export default function ServiceWizard({ isOpen, onClose, categoryId, categoryName }: ServiceWizardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<WizardStep | null>(null);
  const [flow, setFlow] = useState<CategoryFlow | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [finalStep, setFinalStep] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // İletişim bilgileri için state
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    isRegistered: false
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategoryFlow();
    } else {
      resetWizard();
    }
  }, [isOpen, categoryId]);

  // Kategori akışını getir
  const fetchCategoryFlow = async () => {
    setLoading(true);
    try {
      // Gerçek API'niz hazır olduğunda bu kısmı değiştirin
      // const response = await fetch(`/api/category-flow/${categoryId}`);
      // const data = await response.json();
      // setFlow(data);
      // setCurrentStepId(data.initialStepId);

      // Şimdilik mock flow kullanıyoruz (Boya kategorisi için)
      setTimeout(() => {
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
        
        setFlow(mockFlow);
        setCurrentStepId(mockFlow.initialStepId);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Kategori akışını getirirken hata oluştu:", error);
      setLoading(false);
      toast.error("Kategori bilgileri yüklenirken bir hata oluştu");
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

  // Wizard'ı sıfırla
  const resetWizard = () => {
    setCurrentStepId(null);
    setCurrentStep(null);
    setFlow(null);
    setFormData({});
    setFinalStep(false);
    setSubmitting(false);
    setContactInfo({
      fullName: "",
      email: "",
      phone: "",
      isRegistered: false
    });
  };

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
      // Form tamamlandı
      handleSubmit();
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
    
    if (finalStep) {
      // Son adımda iletişim bilgileri alınıyor
      setContactInfo(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // Diğer adımlarda form verileri alınıyor
      setFormData(prev => ({
        ...prev,
        [currentStep.id]: value
      }));
    }
  };

  // Radio/Checkbox seçimi
  const handleOptionSelect = (optionId: string) => {
    if (!currentStep) return;
    
    setFormData(prev => ({
      ...prev,
      [currentStep.id]: optionId
    }));
  };

  // E-posta gönder
  const sendEmail = async (data: any) => {
    try {
      // Form verilerini düzenle
      const emailParams = {
        to_email: 'ahmetguner74@gmail.com',
        from_name: data.contactInfo.fullName,
        from_email: data.contactInfo.email,
        from_phone: data.contactInfo.phone,
        message: `
          Kategori: ${data.categoryName}
          
          Form Verileri:
          ${Object.entries(data.formData).map(([key, value]) => {
            const step = data.flow?.steps.find(s => s.id === key);
            if (!step) return `${key}: ${value}`;
            
            // Seçenek tipinde değerler için etiketleri ekle
            if (step.options && (step.type === 'radio' || step.type === 'checkbox' || step.type === 'select')) {
              const option = step.options.find(o => o.id === value);
              if (option) {
                return `${step.question}: ${option.label}`;
              }
            }
            
            return `${step.question}: ${value}`;
          }).join('\n')}
          
          Adres: ${data.formData['step-8'] || 'Belirtilmemiş'}
          
          Bu talep otomatik olarak oluşturulmuştur.
        `,
        subject: `Yeni Hizmet Talebi: ${data.categoryName}`
      };
      
      // EmailJS'yi kullanarak e-posta gönder
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_id', 
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_id',
        emailParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'public_key'
      );
      
      console.log('E-posta başarıyla gönderildi:', result.text);
      return true;
    } catch (error) {
      console.error('E-posta gönderim hatası:', error);
      return false;
    }
  };

  // Form gönderimi
  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      // Form verilerini düzenle
      const requestData = {
        categoryId,
        categoryName,
        formData,
        contactInfo,
        flow // Adım bilgilerini de ekle
      };
      
      // E-posta gönder
      const emailSuccess = await sendEmail(requestData);
      
      // WhatsApp bağlantısı oluştur
      const whatsappText = `Yeni Hizmet Talebi - ${contactInfo.fullName} adlı müşteriden ${categoryName} kategorisinde talep geldi. Telefon: ${contactInfo.phone}`;
      const whatsappLink = `https://wa.me/905313553274?text=${encodeURIComponent(whatsappText)}`;
      
      if (!emailSuccess) {
        toast.error("E-posta gönderilirken bir hata oluştu, ancak talebiniz alındı.");
      } else {
        toast.success("Talebiniz başarıyla alındı. En kısa sürede size dönüş yapılacak.");
      }
      
      // WhatsApp bağlantısını aç
      const openWhatsApp = window.confirm("WhatsApp üzerinden hizmet sağlayıcılarımıza doğrudan ulaşmak ister misiniz?");
      if (openWhatsApp) {
        window.open(whatsappLink, '_blank');
      }
      
      onClose();
      resetWizard();
      router.push("/talep-basarili");
    } catch (error) {
      console.error("Form gönderiminde hata:", error);
      toast.error("Talebiniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  // Modal dışına tıklandığında kapat
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !submitting) {
      onClose();
    }
  };

  // Mevcut adımda kullanıcının bir seçim yapıp yapmadığını kontrol et
  const isStepValid = () => {
    if (!currentStep) return false;
    
    if (finalStep) {
      // Son adımda iletişim bilgilerinin doğruluğunu kontrol et
      return (
        contactInfo.fullName.trim() !== '' &&
        contactInfo.phone.trim() !== '' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)
      );
    }
    
    // Adım zorunlu değilse geçerli kabul et
    if (!currentStep.required) return true;
    
    // Diğer adımlarda ilgili veri var mı kontrol et
    return formData[currentStep.id] !== undefined && formData[currentStep.id] !== '';
  };

  // Modal açık değilse gösterme
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{categoryName}</h2>
            {currentStep && <p className="text-sm text-gray-500">{currentStep.title}</p>}
          </div>
          <button 
            onClick={onClose}
            disabled={submitting}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* İçerik */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Yükleniyor...</span>
            </div>
          ) : currentStep ? (
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
                        value={contactInfo.fullName}
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
                        value={contactInfo.email}
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
                        value={contactInfo.phone}
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
                  disabled={flow?.steps.findIndex(s => s.id === currentStepId) === 0 || submitting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={finalStep ? handleSubmit : goToNextStep}
                  disabled={!isStepValid() || submitting}
                  className={`px-6 py-2 rounded-md font-medium text-white ${
                    isStepValid() && !submitting
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>İşleniyor...</span>
                    </div>
                  ) : finalStep ? (
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
      </div>
    </div>
  );
} 