"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/src/i18n/routing";
import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import LoadingOverlay from "@/components/loader/loader";

export default function MobileNav() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parentOpen, setParentOpen] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  const handleBurgerClick = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle("mobile-menu-active");
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("/api/navigation");
        if (!response.ok) throw new Error("Failed to fetch navigation");
        const data = await response.json();
        setRoutes(data.data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center p-4">
        <LoadingOverlay />
      </div>
    );

  return (
    <>
      <button
        className={`menu-icon ${isOpen ? "menu-close" : ""}`}
        onClick={handleBurgerClick}
      >
        <span className="h-0.5 w-6 bg-current block transition-all"></span>
        <span className="h-0.5 w-6 bg-current block mt-2 transition-all"></span>
        <span className="h-0.5 w-6 bg-current block mt-2 transition-all"></span>
      </button>

      <div
        className={`mobile-header-active ${isOpen ? "sidebar-visible" : ""}`}
      >
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <nav className="mt-4">
              <ul className="mobile-menu">
                {routes.map((route, i) => (
                  <li key={route.id} className="mb-2">
                    {route.subMenu ? (
                      <>
                        <button
                          onClick={() =>
                            setParentOpen(i === parentOpen ? -1 : i)
                          }
                          className={`flex items-center justify-between w-full p-2 text-lg
                            ${i === parentOpen ? "text-primary" : ""}`}
                        >
                          {route.translations[locale]}
                          <svg
                            className={`w-4 h-4 transition-transform 
                              ${i === parentOpen ? "rotate-180" : ""}`}
                            viewBox="0 0 16 10"
                          >
                            <path
                              d="M15.7911 1.0474C15.5023 0.741097 15.0192 0.729691 14.7145 1.01768L7.99961 7.37897L1.28555 1.01772C0.980773 0.728941 0.498472 0.741128 0.208947 1.04743C-0.080577 1.35296 -0.0676398 1.83526 0.237916 2.12478L7.47618 8.98209C7.62246 9.12077 7.81143 9.19087 7.99961 9.19087C8.18779 9.19087 8.37751 9.12077 8.52382 8.98209L15.7621 2.12478C16.0676 1.83523 16.0806 1.35296 15.7911 1.0474Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                        <ul
                          className={`pl-4 ${
                            i === parentOpen ? "block" : "hidden"
                          }`}
                        >
                          {route.subMenu.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                href={`/${locale}/${subItem.path}`}
                                className={`block p-2 ${
                                  pathname === `/${locale}/${subItem.path}`
                                    ? "text-primary"
                                    : ""
                                }`}
                              >
                                {subItem.translations[locale]}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link
                        href={`/${locale}/${route.path}`}
                        className={`block p-2 ${
                          pathname === `/${locale}/${route.path}`
                            ? "text-primary"
                            : ""
                        }`}
                      >
                        {route.translations[locale]}
                      </Link>
                    )}
                  </li>
                ))}
                <li className="mt-6 flex items-center space-x-2 p-2">
                  <Languages className="h-5 w-5" />
                  <Link
                    href={pathname}
                    locale={locale === "en" ? "ka" : "en"}
                    className="text-lg hover:text-primary transition-colors"
                  >
                    {locale === "en" ? "KA" : "EN"}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
