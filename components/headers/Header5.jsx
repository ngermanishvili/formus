"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/src/i18n/routing";
import { useLocale } from "next-intl";
import { Phone } from "lucide-react";
import MobileHeader1 from "@/components/headers/MobailHeader1";

const routes = [
  {
    id: 1,
    path: "/",
    translations: {
      ka: "მთავარი",
      en: "Home",
    },
  },
  {
    id: 2,
    path: "/about-formus",
    translations: {
      ka: "ჩვენ შესახებ",
      en: "About Us",
    },
  },
  {
    id: 3,
    path: "/projects",
    translations: {
      ka: "პროექტები",
      en: "Projects",
    },
  },
  {
    id: 4,
    path: "/choose-apartment",
    translations: {
      ka: "შეარჩიეთ ბინა",
      en: "Choose Home",
    },
    showOnlyOnHome: true,
  },
  {
    id: 5,
    path: "/media",
    translations: {
      ka: "სიახლეები",
      en: "News",
    },
  },
];

const languageNames = {
  ka: "KA",
  en: "ENG",
};

export default function Header5() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  const isHomePage = pathname === `/${locale}` || pathname === "/";
  const georgianTextClass =
    locale === "ka" ? "[font-feature-settings:'case'_on]" : "";

  const scrollToFooter = (e) => {
    e.preventDefault();
    const footer = document.querySelector("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleChooseHomeClick = (e, routePath) => {
    if (routePath === "/choose-apartment") {
      e.preventDefault();
      window.scrollTo({
        top: document.documentElement.scrollHeight * 0.8,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getFullPath = (routePath) => {
    return routePath.startsWith("/") ? routePath : `/${routePath}`;
  };

  const isActivePath = (routePath) => {
    const currentPath = pathname.split("/").slice(2).join("/");
    return currentPath === routePath.replace(/^\//, "");
  };

  const getLocalizedPath = (targetLocale) => {
    if (pathname === `/${locale}`) {
      return `/${targetLocale}`;
    }
    const segments = pathname.split("/");
    const filteredSegments = segments.filter((segment) => segment !== "");
    if (filteredSegments[0] === locale) {
      filteredSegments.shift();
    }
    return `/${targetLocale}/${filteredSegments.join("/")}`;
  };

  const toggleLanguage = () => {
    const newLocale = locale === "ka" ? "en" : "ka";
    window.location.href = getLocalizedPath(newLocale);
  };

  const visibleRoutes = routes.filter(
    (route) => !route.showOnlyOnHome || (route.showOnlyOnHome && isHomePage)
  );

  return (
    <>
      <div className="block min-[940px]:hidden">
        <MobileHeader1 routes={visibleRoutes} languageNames={languageNames} />
      </div>

      <div className="hidden min-[940px]:block">
        <header
          className={`fixed w-full flex justify-center top-0 z-50 bg-[#00326B] transition-all duration-300 ${
            scrolled ? "shadow-lg" : ""
          }`}
        >
          <div className="mx-auto max-w-7xl w-[1280px] px-36">
            <div className="flex items-center justify-between py-3">
              {/* ლოგო მარცხენა მხარეს */}
              <Link
                href="/"
                className="text-white text-lg font-bold font-firago"
              >
                FORMUS
              </Link>

              {/* ნავიგაცია ცენტრში */}
              <nav className="flex items-center gap-4 uppercase font-firago justify-center">
                {visibleRoutes.map((route) => (
                  <Link
                    key={route.id}
                    href={getFullPath(route.path)}
                    onClick={(e) => handleChooseHomeClick(e, route.path)}
                    className={`${
                      isActivePath(route.path) ? "text-white" : "text-gray-200"
                    } whitespace-nowrap text-md hover:text-[#FBB102] transition-colors ${georgianTextClass}`}
                  >
                    {route.translations[locale]}
                  </Link>
                ))}
              </nav>

              {/* ენის არჩევა და ტელეფონი მარჯვენა მხარეს */}
              <div className="flex items-center space-x-2 font-firago justify-end">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center text-xs text-white hover:text-[#f94011] transition-colors"
                >
                  <span>{languageNames[locale]}</span>
                </button>

                <a
                  onClick={scrollToFooter}
                  href="tel:+995123456789"
                  className="flex items-center text-white hover:text-[#f94011] transition-colors ml-2"
                >
                  <Phone className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
