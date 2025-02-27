"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link, usePathname } from "@/src/i18n/routing";
import { useLocale } from "next-intl";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/assets/imgs/logo/formus-header1.png";

const MobileHeader = ({ routes, languageNames }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMenuOpen]);

  // Preserve the current locale when navigating
  const getLocalizedPath = (targetLocale) => {
    if (pathname === `/${locale}`) return `/${targetLocale}`;
    const segments = pathname.split("/").filter((segment) => segment !== "");
    if (segments[0] === locale) segments.shift();
    return `/${targetLocale}/${segments.join("/")}`;
  };

  const toggleLanguage = () => {
    const newLocale = locale === "ka" ? "en" : "ka";
    router.push(getLocalizedPath(newLocale));
  };

  const scrollToFooter = (e) => {
    e.preventDefault();
    document.querySelector("footer")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChooseHomeClick = (e, routePath) => {
    if (routePath === "/choose-apartment") {
      e.preventDefault();
      setIsMenuOpen(false);
      if (pathname !== `/${locale}` && pathname !== "/") {
        router.push(`/${locale}?scrollToApartments=true`);
      } else {
        window.scrollTo({
          top: document.documentElement.scrollHeight * 0.3,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 bg-[#00326B] transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-white p-2 -ml-2 hover:text-[#f94011] transition-colors"
            >
              <Menu size={24} />
            </button>
            <Link href={`/${locale}`} className="text-white text-xl font-bold">
              <div className="w-28 h-10 relative">
                <Image
                  src={Logo}
                  alt="Formus Logo"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </Link>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLanguage}
                className="text-white hover:text-[#f94011] transition-colors"
              >
                <span>{languageNames[locale]}</span>
              </button>
              <a
                onClick={scrollToFooter}
                href="tel:+995123456789"
                className="text-white hover:text-[#f94011] transition-colors p-2"
              >
                <Phone size={20} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#00326B] z-50">
          <div className="min-h-screen flex flex-col">
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
              <Link
                href={`/${locale}`}
                className="text-white text-xl font-bold"
              >
                FORMUS
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white p-2 -mr-2 hover:text-[#f94011] transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-8">
              <div className="space-y-6">
                {routes.map((route) => (
                  <Link
                    key={route.id}
                    href={`/${locale}${route.path}`}
                    className="block text-lg text-white hover:text-[#f94011] transition-colors"
                    onClick={(e) => {
                      if (route.path === "/choose-apartment") {
                        handleChooseHomeClick(e, route.path);
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    {route.translations[locale]}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
