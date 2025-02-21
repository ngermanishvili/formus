"use client";
import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import BreadCumpShape from "@/public/assets/shapes/home/2.png";

const translations = {
  en: {
    projects: "News",
    decorativeShape: "Decorative shape",
  },
  ka: {
    projects: "სიახლეები",
    decorativeShape: "დეკორატიული ფორმა",
  },
};

export default function BreadCumb() {
  const locale = useLocale();
  const t = translations[locale];

  return (
    <div className="section pt-60 mt-[50px] bg-white relative">
      <div className="container-sub relative">
        <div className="absolute mr-[24px]  top-[20px] transform -translate-y-1/2">
          <Image
            src={BreadCumpShape}
            alt={t.decorativeShape}
            width={90}
            height={90}
          />
        </div>
        <h1 className="heading-44-medium color-black mb-5 relative z-10">
          {t.projects}
        </h1>
        <div className="box-breadcrumb"></div>
      </div>
    </div>
  );
}
