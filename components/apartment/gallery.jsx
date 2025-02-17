"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Photo from "@/public/assets/imgs/ortachala/ortachala-hills.jpg";

const GalleryGrid = () => {
  const [activeCategory, setActiveCategory] = useState("exterior");
  const [currentLang, setCurrentLang] = useState("en");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        src: "https://res.cloudinary.com/ds9dsumwl/image/upload/v1739541169/5.4._%E1%83%9D%E1%83%A0%E1%83%97%E1%83%90%E1%83%AD%E1%83%90%E1%83%9A%E1%83%90_%E1%83%B0%E1%83%98%E1%83%9A%E1%83%A1%E1%83%98-%E1%83%9B%E1%83%9D%E1%83%99%E1%83%9A%E1%83%94_%E1%83%90%E1%83%A6%E1%83%AC%E1%83%94%E1%83%A0%E1%83%98%E1%83%97_e2v9rk.jpg",
        alt: currentLang === "ka" ? "ექსტერიერი 1" : "Exterior View 1",
      },
      {
        src: "https://res.cloudinary.com/ds9dsumwl/image/upload/v1739541169/7.2._%E1%83%A7%E1%83%9D%E1%83%95%E1%83%94%E1%83%9A%E1%83%93%E1%83%A6%E1%83%98%E1%83%A3%E1%83%A0%E1%83%98_%E1%83%AA%E1%83%AE%E1%83%9D%E1%83%95%E1%83%A0%E1%83%94%E1%83%91%E1%83%98%E1%83%A1%E1%83%97%E1%83%95%E1%83%98%E1%83%A1_%E1%83%90%E1%83%A3%E1%83%AA%E1%83%98%E1%83%9A%E1%83%94%E1%83%91%E1%83%94%E1%83%9A%E1%83%98_%E1%83%9D%E1%83%91%E1%83%98%E1%83%94%E1%83%A5%E1%83%A2%E1%83%94%E1%83%91%E1%83%98_%E1%83%94%E1%83%A0%E1%83%97_%E1%83%A1%E1%83%98%E1%83%95%E1%83%A0%E1%83%AA%E1%83%94%E1%83%A8%E1%83%98_rytck6.jpg",
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

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setSelectedImage(currentImages[index]);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsClosing(true);
    document.body.style.overflow = "unset";
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedImage(null);
      setIsClosing(false);
    }, 300);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const newIndex = (currentImageIndex + 1) % currentImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentImages[newIndex]);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const newIndex =
      (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isModalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage(e);
      if (e.key === "ArrowLeft") prevImage(e);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isModalOpen, currentImageIndex]);

  return (
    <>
      <div className="mx-auto py-16">
        <h2 className="font-firago font-bold text-4xl text-center mb-4">
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
              <div
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openModal(0)}
              >
                <Image
                  src={currentImages[0].src}
                  alt={currentImages[0].alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openModal(1)}
              >
                <Image
                  src={currentImages[1].src}
                  alt={currentImages[1].alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <div
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openModal(2)}
              >
                <Image
                  src={currentImages[2].src}
                  alt={currentImages[2].alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            </div>
          </div>

          {/* Second Gallery Section */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openModal(3)}
              >
                <Image
                  src={currentImages[3].src}
                  alt={currentImages[3].alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <div
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openModal(4)}
              >
                <Image
                  src={currentImages[4].src}
                  alt={currentImages[4].alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            </div>
            <div
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openModal(5)}
            >
              <Image
                src={currentImages[5].src}
                alt={currentImages[5].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-50 p-2 text-white hover:text-gray-300 transition-colors"
            onClick={closeModal}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          <button
            className="absolute left-4 md:left-8 z-50 p-2 text-white hover:text-gray-300 transition-colors"
            onClick={prevImage}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            className="absolute right-4 md:right-8 z-50 p-2 text-white hover:text-gray-300 transition-colors"
            onClick={nextImage}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image Container */}
          <div
            className={`relative w-full max-w-7xl mx-4 aspect-[16/9] transition-transform duration-300 ${
              isClosing ? "scale-95" : "scale-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage && (
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
