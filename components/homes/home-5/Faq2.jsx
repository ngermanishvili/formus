"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CldImage } from "next-cloudinary";

export default function Faq() {
  const t = useTranslations("faq");

  return (
    <section className="relative bg-white -mt-24">
      <div className="flex flex-col lg:flex-row items-stretch min-h-screen">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 px-8 lg:px-16 py-16 flex flex-col justify-center">
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

        {/* Right Image */}
        <div className="w-full lg:w-1/2  h-screen sticky top-0">
          <CldImage
            src="1.ფორმუსის_მოკლე_About_us_rmogdh"
            alt={t("title")}
            width={960}
            height={1080}
            quality={80}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}
