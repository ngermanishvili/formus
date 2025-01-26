import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

export default function BreadCumb() {
  const t = useTranslations("Breadcrumb");

  return (
    <div className="section pt-60 pb-60 bg-primary">
      <div className="container-sub">
        <h1 className="heading-44-medium color-white mb-5">{t("blog")}</h1>
        <div className="box-breadcrumb">
          <ul>
            <li>
              <Link href="/">{t("home")}</Link>
            </li>
            <li>
              <Link href="/blog-grid">{t("blog")}</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
