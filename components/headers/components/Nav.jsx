"use client";
import { Link, usePathname } from "@/src/i18n/routing";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { routing } from "@/src/i18n/routing";

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
    // Remove locale prefix if present
    const segments = path.split("/");
    if (segments.length > 2 && routing.locales.includes(segments[1])) {
      return segments.slice(2).join("/");
    }
    return segments.slice(1).join("/");
  };

  const currentPath = getPathWithoutLocale(pathname);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex space-x-2 my-4 uppercase">
      {routes.map((route) => (
        <li key={route.id} className="list-none">
          <Link
            href={route.path} // Let next-intl handle locale prefixing
            className={`${
              currentPath === route.path ? "active-link" : ""
            } whitespace-nowrap`}
          >
            {route.translations[locale]}
          </Link>
        </li>
      ))}
    </div>
  );
}
