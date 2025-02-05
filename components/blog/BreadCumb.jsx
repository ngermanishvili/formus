import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

export default function BreadCumb() {
  const t = useTranslations("Breadcrumb");

  return (
    <div className="section pt-60 pb-60 bg-primary">
      <div className="container-sub">
        <h1 className="heading-44-medium color-white mb-5">მედია</h1>
        <div className="box-breadcrumb"></div>
      </div>
    </div>
  );
}
