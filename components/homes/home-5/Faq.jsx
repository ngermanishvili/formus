"use client";

import { useTranslations } from "next-intl";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

export default function Faq() {
  const t = useTranslations("faq");

  return (
    <section className="relative bg-white -mt-4">
      <div className="flex flex-col lg:flex-row items-stretch">
        <div className="w-full lg:w-1/2 px-8 lg:px-16 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-black mb-8 leading-tight">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            {t("description")}
          </p>
          <Link href="/about-formus">
            <span className="inline-block text-lg text-white bg-black px-8 py-3 rounded-sm hover:bg-gray-800 transition-colors">
              {t("button")}
            </span>
          </Link>
        </div>
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[800px] overflow-hidden">
          <CldImage
            src="1.ფორმუსის_მოკლე_About_us_rmogdh"
            alt={t("title")}
            width={960}
            height={800}
            quality={80}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}
