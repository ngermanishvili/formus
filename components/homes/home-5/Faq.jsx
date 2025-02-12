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

export default function HeroSection() {
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
      <div className="flex flex-col lg:flex-row items-stretch">
        <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-16 flex flex-col justify-center ml-0 sm:ml-[50px] lg:ml-[100px] mb-[200px] sm:mb-[250px] lg:mb-[350px] relative pt-12 sm:pt-16 lg:pt-0">
          <div className="absolute left-[20px] sm:left-[150px] lg:left-[280px] top-[85px] sm:top-[95px] lg:top-[70px] -translate-y-1/2">
            <Image
              src={TitleShape}
              alt="Decorative shape"
              width={70}
              height={70}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl mt-2 font-bold text-black mb-6 sm:mb-8 leading-tight ml-4 sm:ml-[100px] lg:ml-[270px] relative z-10">
            {isGeorgian ? "ფორმუსი" : "FORMUS"}
          </h2>
          <h2 className="text-2xl sm:text-4xl font-thin text-black mb-6 sm:mb-8 leading-tight ml-4 sm:ml-[100px] lg:ml-[270px] relative z-10">
            {isGeorgian ? heroContent?.title_ge : heroContent?.title_en}
          </h2>
          <div className="relative">
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mt-2 mb-8 sm:mb-10 ml-4 sm:ml-[100px] lg:ml-[270px] relative z-10">
              {isGeorgian
                ? heroContent?.description_ge
                : heroContent?.description_en}
            </p>
          </div>
          <Link
            href="/about-formus"
            className="block lg:absolute lg:bottom-4 lg:left-[370px] lg:-translate-x-1/2 w-40 mx-auto sm:ml-[100px] lg:ml-0"
          >
            <Button className="w-full h-10 bg-[#Fcb203] text-black font-bold text-lg rounded-md right-0 shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
              {isGeorgian ? "ვრცლად" : "Read More"}
            </Button>
          </Link>
        </div>

        <div className="w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[800px] overflow-hidden">
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
