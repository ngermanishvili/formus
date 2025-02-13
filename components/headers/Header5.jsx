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
    path: "/about",
    translations: {
      ka: "ჩვენ შესახებ",
      en: "About",
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
    path: "/choose-home",
    translations: {
      ka: "აირჩიე ბინა",
      en: "Choose Home",
    },
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
  ka: "GE",
  en: "ENG",
};

export default function Header5() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  return isMobile ? (
    <MobileHeader1 />
  ) : (
    <header
      className={`fixed w-full top-0 z-50 bg-[#00326B] transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          <nav className="flex items-center space-x-1 -ml-4 uppercase">
            {routes.map((route) => (
              <Link
                key={route.id}
                href={getFullPath(route.path)}
                className={`${
                  isActivePath(route.path) ? "text-white" : "text-gray-200"
                } px-2 py-1 text-sm hover:text-[#FBB102] rounded transition-colors`}
              >
                {route.translations[locale]}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="text-white text-2xl font-bold absolute left-1/2 -translate-x-1/2"
          >
            FORMUS
          </Link>

          <div className="flex items-center space-x-4 -mr-[-100px]">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-white hover:text-[#f94011] transition-colors"
            >
              <span>{languageNames[locale]}</span>
            </button>

            <a
              href="tel:+995123456789"
              className="flex items-center space-x-1 text-white hover:text-[#f94011] transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
