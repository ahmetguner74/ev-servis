"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Sayfa kaydırıldığında header'ı değiştir
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Hizmetler", href: "/hizmetler" },
    { name: "Sağlayıcılar", href: "/saglayicilar" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md py-3" 
          : "bg-white shadow-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold mr-3 group-hover:shadow-lg transition-shadow">
              <span className="text-xl">EH</span>
            </div>
            <span className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
              Ev<span className="text-blue-600 group-hover:text-gray-900 transition-colors">Hizmetleri</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === link.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profil"
                  className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Profilim
                </Link>
                <Link
                  href="/cikis"
                  className="px-4 py-2 font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                >
                  Çıkış Yap
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/giris"
                  className="px-4 py-2 font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="px-4 py-2 font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none p-2 rounded-lg hover:bg-gray-50"
            aria-label={isMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 shadow-lg">
          <div className="container mx-auto px-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block py-2 px-4 rounded-lg font-medium ${
                  pathname === link.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-3">
              {session ? (
                <>
                  <Link
                    href="/profil"
                    className="block py-2 px-4 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profilim
                  </Link>
                  <Link
                    href="/cikis"
                    className="block py-2 px-4 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Çıkış Yap
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/giris"
                    className="block py-2 px-4 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="block py-2 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 