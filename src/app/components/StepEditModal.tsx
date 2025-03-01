"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Adım tipi
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
  nextStep?: string | null;
  conditionalNextStep?: Array<{
    optionId: string;
    nextStepId: string;
  }>;
  order: number;
};

interface StepEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: Step | null;
  allSteps: Step[];
  onSave: (step: Step) => void;
  isNew?: boolean;
}

export default function StepEditModal({ 
  isOpen, 
  onClose, 
  step, 
  allSteps, 
  onSave,
  isNew = false
}: StepEditModalProps) {
  const [formData, setFormData] = useState<Step | null>(null);
  const [optionText, setOptionText] = useState("");
  const [saving, setSaving] = useState(false);
  const [optionError, setOptionError] = useState(false);

  // Modal açıldığında form verilerini ayarla
  useEffect(() => {
    if (isOpen && step) {
      setFormData({...step});
    } else {
      setFormData(null);
      setOptionText("");
    }
  }, [isOpen, step]);

  // Modal dışına tıklandığında kapat
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !saving) {
      onClose();
    }
  };

  // Form değişikliklerini işle
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Checkbox değişikliklerini işle
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    
    const { name, checked } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: checked } : null);
  };

  // Yeni seçenek ekle
  const handleAddOption = () => {
    if (!formData || !optionText.trim()) {
      setOptionError(true);
      return;
    }
    
    setOptionError(false);
    
    const newOption = {
      id: `opt-${Date.now()}`,
      label: optionText,
      value: optionText.toLowerCase().replace(/\s+/g, '-')
    };
    
    setFormData(prev => {
      if (!prev) return null;
      
      const options = prev.options ? [...prev.options, newOption] : [newOption];
      return { ...prev, options };
    });
    
    setOptionText("");
  };

  // Seçenek sil
  const handleRemoveOption = (optionId: string) => {
    if (!formData) return;
    
    setFormData(prev => {
      if (!prev || !prev.options) return prev;
      
      // Seçenekleri güncelle
      const options = prev.options.filter(opt => opt.id !== optionId);
      
      // Koşullu yönlendirmeleri de güncelle
      let conditionalNextStep = prev.conditionalNextStep;
      if (conditionalNextStep) {
        conditionalNextStep = conditionalNextStep.filter(c => c.optionId !== optionId);
        if (conditionalNextStep.length === 0) conditionalNextStep = undefined;
      }
      
      return { ...prev, options, conditionalNextStep };
    });
  };

  // Koşullu adım ekle/güncelle
  const handleConditionalNext = (optionId: string, nextStepId: string) => {
    if (!formData) return;
    
    setFormData(prev => {
      if (!prev) return null;
      
      let conditionalNext = prev.conditionalNextStep || [];
      
      // Mevcut koşulu güncelle veya yeni koşul ekle
      const existingIndex = conditionalNext.findIndex(c => c.optionId === optionId);
      
      if (existingIndex !== -1) {
        conditionalNext[existingIndex].nextStepId = nextStepId;
      } else {
        conditionalNext.push({ optionId, nextStepId });
      }
      
      return { ...prev, conditionalNextStep: conditionalNext };
    });
  };

  // Formu kaydet
  const handleSave = () => {
    if (!formData) return;
    
    // Form validasyonu
    if (!formData.title.trim() || !formData.question.trim() || !formData.type) {
      toast.error("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }
    
    // Radio, checkbox veya select tipindeki sorular için seçenek olmalı
    if (
      (formData.type === "radio" || formData.type === "checkbox" || formData.type === "select") && 
      (!formData.options || formData.options.length < 2)
    ) {
      toast.error("Lütfen en az 2 seçenek ekleyin.");
      return;
    }
    
    setSaving(true);
    
    try {
      onSave(formData);
      toast.success(isNew ? "Adım başarıyla oluşturuldu." : "Adım başarıyla güncellendi.");
      onClose();
    } catch (error) {
      console.error("Adım kaydedilirken hata oluştu:", error);
      toast.error("Adım kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isNew ? "Yeni Adım Ekle" : "Adımı Düzenle"}
          </h2>
          <button 
            onClick={onClose}
            disabled={saving}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Başlık */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Adım Başlığı *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Örn: Boya Türü"
                required
              />
            </div>
            
            {/* Soru */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Soru *
              </label>
              <textarea
                id="question"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Örn: Hangi tür boya hizmeti almak istiyorsunuz?"
                required
              />
            </div>

            {/* Input Tipi */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Yanıt Türü *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="radio">Tekli Seçim (Radio)</option>
                <option value="checkbox">Çoklu Seçim (Checkbox)</option>
                <option value="text">Kısa Metin</option>
                <option value="textarea">Uzun Metin</option>
                <option value="select">Açılır Liste (Select)</option>
                <option value="date">Tarih</option>
                <option value="time">Saat</option>
                <option value="address">Adres</option>
              </select>
            </div>

            {/* Zorunlu mu? */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                name="required"
                checked={formData.required}
                onChange={handleCheckboxChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
                Bu adım zorunlu
              </label>
            </div>

            {/* Placeholder (sadece text, textarea ve address için) */}
            {(formData.type === "text" || formData.type === "textarea" || formData.type === "address") && (
              <div>
                <label htmlFor="placeholder" className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  id="placeholder"
                  name="placeholder"
                  value={formData.placeholder || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Örn: Detayları buraya yazabilirsiniz..."
                />
              </div>
            )}

            {/* Seçenekler (sadece radio, checkbox ve select için) */}
            {(formData.type === "radio" || formData.type === "checkbox" || formData.type === "select") && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Seçenekler
                  </label>
                </div>
                
                {/* Mevcut seçenekler */}
                <div className="space-y-2 mb-3">
                  {formData.options && formData.options.length > 0 ? (
                    formData.options.map((option) => (
                      <div key={option.id} className="flex items-center justify-between border rounded-lg p-2">
                        <div className="flex items-center">
                          <span className={`w-4 h-4 rounded${formData.type === "checkbox" ? "" : "-full"} border border-gray-300 mr-3`}></span>
                          <span>{option.label}</span>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(option.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          {/* Koşullu yönlendirme (eğer bu adım son adım değilse) */}
                          {formData.nextStep !== null && formData.type === "radio" && (
                            <div className="ml-2">
                              <select
                                value={formData.conditionalNextStep?.find(c => c.optionId === option.id)?.nextStepId || ""}
                                onChange={(e) => handleConditionalNext(option.id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="">Varsayılan sonraki adım</option>
                                {allSteps
                                  .filter(s => s.id !== formData.id)
                                  .map(s => (
                                    <option key={s.id} value={s.id}>
                                      {s.title}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">Henüz seçenek eklenmedi.</p>
                  )}
                </div>
                
                {/* Yeni seçenek ekle */}
                <div className="flex space-x-2 mt-3">
                  <input
                    type="text"
                    value={optionText}
                    onChange={(e) => {
                      setOptionText(e.target.value);
                      if (optionError) setOptionError(false);
                    }}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      optionError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Yeni seçenek"
                  />
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
                {optionError && (
                  <p className="text-sm text-red-500 mt-1">Lütfen bir seçenek metni girin.</p>
                )}
              </div>
            )}

            {/* Sonraki Adım */}
            <div>
              <label htmlFor="nextStep" className="block text-sm font-medium text-gray-700 mb-1">
                Sonraki Adım
              </label>
              <select
                id="nextStep"
                name="nextStep"
                value={formData.nextStep || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Son Adım (Formu Tamamla)</option>
                {allSteps
                  .filter(s => s.id !== formData.id)
                  .map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-70"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Kaydediliyor...</span>
              </div>
            ) : (
              isNew ? "Ekle" : "Kaydet"
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 