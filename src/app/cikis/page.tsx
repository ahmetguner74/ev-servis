"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CikisPage() {
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      router.push("/");
    });
  }, [router]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-4">Çıkış Yapılıyor...</h1>
      <p className="text-gray-600">Lütfen bekleyin, çıkış işleminiz gerçekleştiriliyor.</p>
    </div>
  );
} 