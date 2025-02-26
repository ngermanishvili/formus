"use client";

import { useTranslations } from "next-intl";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import Image from "next/image";
import Shape from "@/public/assets/shapes/home/3.png";
import TitleShape from "@/public/assets/shapes/home/2.png";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Faq() {
  const [heroContent, setHeroContent] = useState([]);
  const pathname = usePathname();
  const isGeorgian = pathname.includes("/ka");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/hero-content");
        const data = await res.json();
        setHeroContent(data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative bg-white -mt-4 sm:-mt-4 md:mt-0 lg:-mt-4">
      <div className="flex flex-col lg:flex-row items-stretch relative">
        <div className="w-full lg:w-1/2 relative h-[600px] lg:h-[800px]">
          <div className="absolute w-full h-full flex items-center justify-center lg:justify-end lg:pr-20 max-md:mt-28">
            <div className="max-w-[400px] mb-[220px]  min-[2000px]:mb-52  max-sm:p-10 max-sm:mt-32">
              <div className="relative mb-4">
                <div className="absolute left-[-30px] top-[0px]">
                  <Image
                    src={TitleShape}
                    alt="Decorative shape"
                    width={80}
                    height={80}
                  />
                </div>
                {/* <h2 className="text-black text-xs relative top-[24px] font-normal">
                  About us
                </h2> */}
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-black leading-tight relative z-10">
                  {isGeorgian ? "ფორმუსი" : "FORMUS"}
                </h2>

                <h2 className="text-2xl sm:text-4xl font-thin text-black relative z-10">
                  {isGeorgian ? heroContent?.title_ge : heroContent?.title_en}
                </h2>

                <p className="text-gray-600 text-base sm:text-lg leading-relaxed relative z-10">
                  {isGeorgian
                    ? heroContent?.description_ge
                    : heroContent?.description_en}
                </p>

                <Link href="/about-formus" className="block w-40 ">
                  <button className="w-full h-10 bg-[#Fcb203] text-black font-normal text-lg rounded-md right-0 shadow-lg flex items-center  transition duration-300 ease-in-out p-4 max-md:mb-[150px]">
                    {isGeorgian ? "გაიგეთ მეტი" : "Learn More"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[900px] overflow-hidden">
          {heroContent?.image_url ? (
            <CldImage
              src={heroContent.image_url}
              alt={isGeorgian ? heroContent?.title_ge : heroContent?.title_en}
              width={960}
              height={800}
              quality={80}
              className="object-cover w-full h-full"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>
      </div>
    </section>
  );
}
