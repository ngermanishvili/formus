"use client";
import { useState, useEffect } from "react";
import { Link } from "@/src/i18n/routing";
import { useLocale } from "next-intl";
import { routing } from "@/src/i18n/routing";
import { Globe, Menu, X, ChevronDown } from "lucide-react";

const languageNames = {
  ka: "GE",
  en: "ENG",
};

const MobileHeader1 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [routes, setRoutes] = useState([]);
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("/api/navigation");
        const data = await response.json();
        setRoutes(data.data || []);
      } catch (error) {
        console.error("Error fetching navigation:", error);
      }
    };
    fetchRoutes();
  }, []);

  // Handle body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 bg-[#00326B] transition-all duration-300 
        ${scrolled ? "shadow-lg" : ""}`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Burger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-white p-2 -ml-2 hover:text-[#f94011] transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className="text-white text-xl font-bold">
              FORMUS
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 text-white p-2 -mr-2 hover:text-[#f94011] transition-colors"
              >
                <Globe size={20} />
                <span className="text-sm">{languageNames[locale]}</span>
              </button>

              {/* Language Dropdown */}
              {isLanguageOpen && (
                <div
                  className="absolute right-0 mt-2 py-1 w-24 bg-white rounded-lg shadow-xl 
                               border border-gray-100 animate-fade-in"
                >
                  {routing.locales.map((l) => (
                    <Link
                      key={l}
                      href="/"
                      className={`block px-4 py-2 text-sm ${
                        l === locale
                          ? "bg-gray-100 text-[#00326B]"
                          : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                      onClick={() => setIsLanguageOpen(false)}
                    >
                      {languageNames[l]}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#00326B] z-50">
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
              <Link href="/" className="text-white text-xl font-bold">
                FORMUS
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white p-2 -mr-2 hover:text-[#f94011] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-8">
              <div className="space-y-6">
                {routes.map((route) => (
                  <Link
                    key={route.id}
                    href={route.path}
                    className="block text-lg text-white hover:text-[#f94011] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {route.translations[locale]}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Backdrop for Language Dropdown */}
      {isLanguageOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsLanguageOpen(false)}
        />
      )}
    </>
  );
};

export default MobileHeader1;
