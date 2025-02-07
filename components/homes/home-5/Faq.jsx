"use client";

import { useTranslations } from "next-intl";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import Image from "next/image";
import Shape from "@/public/assets/shapes/home/3.png";
import TitleShape from "@/public/assets/shapes/home/2.png";

export default function Faq() {
  const t = useTranslations("faq");

  return (
    <section className="relative bg-white -mt-4 sm:-mt-4 md:mt-0 lg:-mt-4">
      <div className="flex flex-col lg:flex-row items-stretch">
        <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-16 flex flex-col justify-center ml-0 sm:ml-[50px] lg:ml-[100px] mb-[200px] sm:mb-[250px] lg:mb-[350px] relative pt-12 sm:pt-16 lg:pt-0">
          <div className="absolute left-[20px] sm:left-[150px] lg:left-[280px] top-[85px] sm:top-[95px] lg:top-[75px] -translate-y-1/2">
            <Image
              src={TitleShape}
              alt="Decorative shape"
              width={70}
              height={70}
            />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 sm:mb-8 leading-tight ml-4 sm:ml-[100px] lg:ml-[270px] relative z-10">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 ml-4 sm:ml-[100px] lg:ml-[270px] relative z-10">
            {t("description")}
          </p>
          <Link href="/about-formus">
            <span className="inline-block text-base sm:text-lg text-white bg-[#fbb200] px-6 sm:px-8 py-3 rounded-sm hover:bg-[#ec9946] transition-colors ml-4 sm:ml-[100px] lg:ml-[270px] relative z-10">
              {t("button")}
            </span>
          </Link>
        </div>

        <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[800px] overflow-hidden">
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
