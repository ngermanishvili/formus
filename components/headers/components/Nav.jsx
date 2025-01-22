"use client";
import { Link, usePathname } from "@/src/i18n/routing";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export default function Nav() {
  const pathname = usePathname();
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("/api/navigation", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

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

  // Modified to preserve language prefix
  const getPathWithoutLocale = (path) => {
    const segments = path.split("/");
    return segments.length > 2 ? segments.slice(2).join("/") : "";
  };

  const currentPath = getPathWithoutLocale(pathname);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex space-x-2 my-4">
      {routes.map((route) => (
        <li key={route.id} className="list-none">
          <Link
            href={`/${locale}/${route.path}`} // Modified to include locale
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
