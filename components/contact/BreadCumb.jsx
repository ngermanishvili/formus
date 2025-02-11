"use client";
import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import BreadCumpShape from "@/public/assets/shapes/home/2.png";

const translations = {
  en: {
    contact: "Contact",
    decorativeShape: "Decorative shape",
  },
  ka: {
    contact: "კონტაქტი",
    decorativeShape: "დეკორატიული ფორმა",
  },
};

export default function BreadCumb() {
  const locale = useLocale();
  const t = translations[locale];

  return (
    <div className="section pt-60 mt-[50px] bg-white">
      <div className="absolute left-[10px] sm:left-[50px] lg:left-[260px] top-[60px] sm:top-[95px] lg:top-[135px] -translate-y-1/2 z-0">
        <Image
          src={BreadCumpShape}
          alt={t.decorativeShape}
          width={100}
          height={100}
          className="z-0 w-[50px] h-[50px] sm:w-[70px] sm:h-[70px]"
        />
      </div>
      <div className="container-sub">
        <h1 className="heading-44-medium color-black mb-5 relative z-10">
          {t.contact}
        </h1>
        <div className="box-breadcrumb"></div>
      </div>
    </div>
  );
}
