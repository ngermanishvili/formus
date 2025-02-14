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
          <div className="absolute right-[424px] top-[100px] sm:top-[95px] lg:top-[95px] -translate-y-1/2 font-bold">
            <Image
              src={TitleShape}
              alt="Decorative shape"
              width={80}
              height={80}
            />
          </div>

          <div className="absolute right-20 top-[120px] sm:top-[140px] lg:top-[70px] max-w-[400px] ">
            <h2 className="text-black text-xs">About us</h2>

            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2 leading-tight relative z-10">
              {isGeorgian ? "ფორმუსი" : "FORMUS"}
            </h2>
            <h2 className="text-2xl sm:text-4xl font-thin text-black mb-4 relative z-10">
              {isGeorgian ? heroContent?.title_ge : heroContent?.title_en}
            </h2>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 relative z-10 max-w-[500px]">
              {isGeorgian
                ? heroContent?.description_ge
                : heroContent?.description_en}
            </p>

            <Link href="/about-formus" className="block w-40">
              <Button className="w-full h-10 bg-[#Fcb203] text-black font-normal text-lg rounded-md right-0 shadow-lg hover:shadow-xl transition duration-300 ease-in-out p-4">
                {isGeorgian ? "გაიგეთ მეტი" : "Learn More"}
              </Button>
            </Link>
          </div>
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
