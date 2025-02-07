"use client";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/src/i18n/routing";
import { useLocale } from "next-intl";
import { routing } from "@/src/i18n/routing";
import Language from "./components/Language";
import { Globe, Menu } from "lucide-react";
import MobileHeader1 from "@/components/headers/MobailHeader1";

export default function Header5() {
  const [scrolled, setScrolled] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
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

  const getPathWithoutLocale = (path) => {
    const segments = path.split("/");
    return segments.length > 2 && routing.locales.includes(segments[1])
      ? segments.slice(2).join("/")
      : segments.slice(1).join("/");
  };

  const currentPath = getPathWithoutLocale(pathname);

  if (isMobile) {
    return <MobileHeader1 />;
  }

  return (
    <header
      className={`fixed w-full top-0 z-50 bg-[#00326B] ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          <nav className="flex items-center space-x-1 -ml-4 uppercase">
            {routes.map((route) => (
              <Link
                key={route.id}
                href={route.path}
                className={`${
                  currentPath === route.path ? "text-white" : "text-gray-200"
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
            <Language />
            <Globe className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
