import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import BreadCumpShape from "@/public/assets/shapes/home/2.png";

export default function BreadCumb() {
  const t = useTranslations("Breadcrumb");

  return (
    <div className="section pt-60 mt-[50px] bg-white">
      <div className="absolute left-[10px] sm:left-[50px] lg:left-[260px] top-[60px] sm:top-[95px] lg:top-[135px] -translate-y-1/2 z-0">
        {/* Adjusted left and top for responsiveness */}
        <Image
          src={BreadCumpShape}
          alt="Decorative shape"
          width={100}
          height={100}
          className="z-0 w-[50px] h-[50px] sm:w-[70px] sm:h-[70px]"
        />
        {/* Adjusted width and height for responsiveness */}
      </div>
      <div className="container-sub">
        <h1 className="heading-44-medium color-black mb-5 relative z-10">
          პროექტები
        </h1>
        <div className="box-breadcrumb"></div>
      </div>
    </div>
  );
}
