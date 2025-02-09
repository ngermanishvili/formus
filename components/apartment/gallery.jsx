"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Photo from "@/public/assets/imgs/ortachala/ortachala-hills.jpg";

const GalleryGrid = () => {
  const [activeCategory, setActiveCategory] = useState("exterior");
  const [currentLang, setCurrentLang] = useState("en");

  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/ka")) {
      setCurrentLang("ka");
    } else if (pathname.startsWith("/en")) {
      setCurrentLang("en");
    }
  }, [pathname]);

  const texts = {
    en: {
      title: "Gallery",
      exterior: "Exterior",
      interior: "Interior",
    },
    ka: {
      title: "გალერეა",
      exterior: "ექსტერიერი",
      interior: "ინტერიერი",
    },
  };

  const images = {
    exterior: [
      {
        src: Photo,
        alt: currentLang === "ka" ? "ექსტერიერი 1" : "Exterior View 1",
      },
      {
        src: Photo,
        alt: currentLang === "ka" ? "ექსტერიერი 2" : "Exterior View 2",
      },
      {
        src: Photo,
        alt: currentLang === "ka" ? "ექსტერიერი 3" : "Exterior View 3",
      },
      {
        src: Photo,
        alt: currentLang === "ka" ? "ექსტერიერი 4" : "Exterior View 4",
      },
      {
        src: Photo,
        alt: currentLang === "ka" ? "ექსტერიერი 5" : "Exterior View 5",
      },
      {
        src: Photo,
        alt: currentLang === "ka" ? "ექსტერიერი 6" : "Exterior View 6",
      },
    ],
    interior: [
      {
        src: Photo,
        alt: currentLang === "ka" ? "ინტერიერი 1" : "Interior View 1",
      },
      {
        src: Photo,
        alt: currentLang === "ka" ? "ინტერიერი 2" : "Interior View 2",
      },
      {
        src: Photo,
        alt: currentLang === "ka" ? "ინტერიერი 3" : "Interior View 3",
      },
      {
        src: Photo,
        alt: currentLang === "ka" ? "ინტერიერი 4" : "Interior View 4",
      },
      {
        src: Photo,
        alt: currentLang === "ka" ? "ინტერიერი 5" : "Interior View 5",
      },
      {
        src: Photo,
        alt: currentLang === "ka" ? "ინტერიერი 6" : "Interior View 6",
      },
    ],
  };

  const currentImages = images[activeCategory];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Title */}
      <h2 className="font-firago font-bold text-4xl text-center mb-12">
        {texts[currentLang].title}
      </h2>

      {/* Category Filter */}
      <div className="flex justify-center gap-12 mb-16">
        <button
          onClick={() => setActiveCategory("exterior")}
          className={`font-firago text-lg transition-colors hover:text-foreground ${
            activeCategory === "exterior"
              ? "text-foreground font-medium"
              : "text-muted-foreground font-light"
          }`}
        >
          {texts[currentLang].exterior}
        </button>
        <button
          onClick={() => setActiveCategory("interior")}
          className={`font-firago text-lg transition-colors hover:text-foreground ${
            activeCategory === "interior"
              ? "text-foreground font-medium"
              : "text-muted-foreground font-light"
          }`}
        >
          {texts[currentLang].interior}
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* First Gallery Section */}
        <div className="space-y-8">
          <div className="w-full">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={currentImages[0].src}
                alt={currentImages[0].alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={currentImages[1].src}
                alt={currentImages[1].alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={currentImages[2].src}
                alt={currentImages[2].alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Second Gallery Section */}
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={currentImages[3].src}
                alt={currentImages[3].alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={currentImages[4].src}
                alt={currentImages[4].alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
          <div className="w-full">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={currentImages[5].src}
                alt={currentImages[5].alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryGrid;
