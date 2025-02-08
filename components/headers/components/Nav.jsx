"use client";
import { Link, usePathname } from "@/src/i18n/routing";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { routing } from "@/src/i18n/routing";
import LoadingOverlay from "@/components/loader/loader";

export default function Nav() {
  const pathname = usePathname();
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("/api/navigation");
        if (!response.ok) {
          throw new Error("Failed to fetch navigation");
        }
        const data = await response.json();
        setRoutes(data.data || []);
      } catch (error) {
        console.error("Error fetching navigation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const getPathWithoutLocale = (path) => {
    const segments = path.split("/");
    if (segments.length > 2 && routing.locales.includes(segments[1])) {
      return segments.slice(2).join("/");
    }
    return segments.slice(1).join("/");
  };

  const currentPath = getPathWithoutLocale(pathname);

  if (loading) {
    <LoadingOverlay />;
  }

  return (
    <div className="flex my-4 uppercase">
      {routes.map((route, index) => (
        <li key={route.id} className="list-none">
          <Link
            href={route.path}
            className={`${
              currentPath === route.path ? "active-link" : ""
            } whitespace-nowrap ${index !== routes.length - 1 ? "mr-1" : ""}`}
          >
            {route.translations[locale]}
          </Link>
        </li>
      ))}
    </div>
  );
}
