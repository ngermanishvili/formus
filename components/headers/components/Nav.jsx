"use client";

import { Link, usePathname } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl"; // დავამატოთ ეს

export default function Nav() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const locale = useLocale(); // დავამატოთ ეს
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

  const getPathWithoutLocale = (path) => {
    const segments = path.split("/");
    return segments.length > 2 ? segments.slice(2).join("/") : "";
  };

  const currentPath = getPathWithoutLocale(pathname);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex space-x-6 my-4">
      {" "}
      {/* Added wrapper div with flex */}
      {routes.map((route) => (
        <li key={route.id} className="list-none">
          {" "}
          {/* Added list-none to remove bullet points */}
          <Link
            href={route.path}
            className={`${
              currentPath === route.path ? "active-link" : ""
            } whitespace-nowrap`} // Added whitespace-nowrap
          >
            {route.translations[locale]}
          </Link>
        </li>
      ))}
    </div>
  );
}
