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
    path: "/choose-apartment",
    translations: {
      ka: "აირჩიე ბინა",
      en: "Choose Home",
    },
    showOnlyOnHome: true, // Added this flag
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  const isHomePage = pathname === `/${locale}` || pathname === "/";

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

  // Filter routes based on current page
  const visibleRoutes = routes.filter(
    (route) => !route.showOnlyOnHome || (route.showOnlyOnHome && isHomePage)
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="block md:hidden">
        <MobileHeader1 routes={visibleRoutes} languageNames={languageNames} />
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <header
          className={`fixed w-full top-0 z-50 bg-[#00326B] transition-all duration-300 ${
            scrolled ? "shadow-lg" : ""
          }`}
        >
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between py-4">
              {/* Left Navigation */}
              <nav className="flex items-center space-x-1 -ml-20 uppercase font-firago">
                {visibleRoutes.map((route) => (
                  <Link
                    key={route.id}
                    href={getFullPath(route.path)}
                    onClick={(e) => handleChooseHomeClick(e, route.path)}
                    className={`${
                      isActivePath(route.path) ? "text-white" : "text-gray-200"
                    } px-2 py-1 text-sm hover:text-[#FBB102] rounded transition-colors`}
                  >
                    {route.translations[locale]}
                  </Link>
                ))}
              </nav>

              {/* Center Logo */}
              <Link
                href="/"
                className="text-white text-2xl font-bold absolute left-1/2 -translate-x-1/2 font-firago"
              >
                FORMUS
              </Link>

              {/* Right Actions */}
              <div className="flex items-center space-x-4 -mr-[-150px] font-firago">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center space-x-1 text-white hover:text-[#f94011] transition-colors"
                >
                  <span>{languageNames[locale]}</span>
                </button>

                <a
                  onClick={scrollToFooter}
                  href="tel:+995123456789"
                  className="flex items-center space-x-1 text-white hover:text-[#f94011] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
