"use client";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/src/i18n/routing";
import { useLocale } from "next-intl";
import { routing } from "@/src/i18n/routing";
import { Globe, Menu, ChevronDown } from "lucide-react";
import MobileHeader1 from "@/components/headers/MobailHeader1";

const languageNames = {
  ka: "GE",
  en: "ENG",
};

export default function Header5() {
  const [scrolled, setScrolled] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  const isProjectPath = pathname.includes("/projects/1/ortachala-hilsi");

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

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("/api/navigation");
        const data = await response.json();
        const filteredRoutes = data.data.filter((route) => {
          if (route.id === 5) {
            return pathname.includes("/projects/1/ortachala-hilsi");
          }
          return route.id !== 5;
        });
        setRoutes(filteredRoutes || []);
      } catch (error) {
        console.error("Error fetching navigation:", error);
      }
    };
    fetchRoutes();
  }, [isProjectPath]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".language-dropdown")) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  // სრული path-ის მიღება route-სთვის
  const getFullPath = (routePath) => {
    if (routePath.startsWith("/")) {
      return routePath;
    }
    return `/${routePath}`;
  };

  // მიმდინარე path-ის შემოწმება აქტიური ლინკისთვის
  const isActivePath = (routePath) => {
    const currentPath = pathname.split("/").slice(2).join("/");
    return currentPath === routePath.replace(/^\//, "");
  };

  if (isMobile) {
    return <MobileHeader1 />;
  }

  return (
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
                } px-2 py-1 text-sm hover:text-[#f94011] rounded transition-colors`}
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
            <div className="relative language-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLanguageOpen(!isLanguageOpen);
                }}
                className="flex items-center space-x-1 text-white hover:text-[#f94011] transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>{languageNames[locale]}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isLanguageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 py-2 w-24 bg-white rounded-lg shadow-xl border border-gray-100 animate-slide-up">
                  {routing.locales.map((l) => {
                    // ვიღებთ მიმდინარე path-ს locale-ის გარეშე
                    const pathWithoutLocale = pathname
                      .split("/")
                      .slice(2)
                      .join("/");
                    const newPath = pathWithoutLocale
                      ? `/${pathWithoutLocale}`
                      : "/";

                    return (
                      <Link
                        key={l}
                        href={newPath}
                        locale={l}
                        className={`block px-4 py-2 text-sm ${
                          l === locale
                            ? "bg-gray-100 text-[#00326B]"
                            : "text-gray-700 hover:bg-gray-50"
                        } transition-colors`}
                        onClick={() => setIsLanguageOpen(false)}
                      >
                        {languageNames[l]}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
