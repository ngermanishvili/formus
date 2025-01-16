"use client";
import { Link, usePathname } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function Nav() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
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
    <>
      <li>
        <Link
          href="media"
          className={currentPath === "media" ? "active-link" : ""}
        >
          {t("media")}
        </Link>
      </li>
      <li>
        <Link
          href="about-formus"
          className={currentPath === "about-formus" ? "active-link" : ""}
        >
          {t("about")}
        </Link>
      </li>
      <li>
        <Link
          href="projects"
          className={currentPath === "projects" ? "active-link" : ""}
        >
          {t("projects")}
        </Link>
      </li>
      <li>
        <Link
          href="contact"
          className={currentPath === "contact" ? "active-link" : ""}
        >
          {t("contact")}
        </Link>
      </li>
      <li>
        <Link
          href="choose-apartment"
          className={currentPath === "test" ? "active-link" : ""}
        >
          {t("chooseApartment")}
        </Link>
      </li>
    </>
  );
}
