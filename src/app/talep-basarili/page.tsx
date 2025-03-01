"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RequestSuccessPage() {
  const router = useRouter();
  
  // 5 saniye sonra ana sayfaya yönlendir
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 10000);
    
    return () => clearTimeout(redirectTimer);
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="w-12 h-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Talebiniz Başarıyla Alındı!</h1>
          <p className="text-gray-600 mb-6">
            En kısa sürede sizi arayacağız. Talebiniz için teşekkür ederiz.
          </p>
          
          <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
            <div className="text-sm text-gray-500 mb-2">Bilgilendirme:</div>
            <ul className="text-sm text-gray-600 text-left space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>24 saat içinde talebinizle ilgili hizmet sağlayıcılarımız size ulaşacak.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Size özel fiyat teklifleri alacaksınız.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Sadece onayladığınız hizmet sağlayıcıyla iletişime geçilecek.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              href="/"
              className="flex-1 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium text-center hover:bg-gray-50 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
            <Link 
              href="/hizmetler"
              className="flex-1 py-3 px-4 bg-green-600 rounded-lg text-white font-medium text-center hover:bg-green-700 transition-colors"
            >
              Diğer Hizmetler
            </Link>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            10 saniye içinde otomatik olarak ana sayfaya yönlendirileceksiniz.
          </div>
        </div>
      </div>
    </div>
  );
} 