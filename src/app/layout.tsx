import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import { ToastProvider } from "./providers/ToastProvider";
import Header from "./components/Header";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ev Hizmetleri Platformu",
  description: "Ev hizmetleri için hızlı ve güvenilir çözümler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* EmailJS harici script */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
          strategy="beforeInteractive"
        />
        <Script id="emailjs-init" strategy="afterInteractive">
          {`(function() {
              emailjs.init("${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''}");
            })();`}
        </Script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <Header />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
