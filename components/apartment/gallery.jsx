"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { CldImage } from "next-cloudinary";

const GalleryGrid = () => {
  const [activeCategory, setActiveCategory] = useState("exterior");
  const [currentLang, setCurrentLang] = useState("en");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [galleryPhotos, setGalleryPhotos] = useState({
    exterior: [],
    interior: [],
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/ka")) {
      setCurrentLang("ka");
    } else if (pathname.startsWith("/en")) {
      setCurrentLang("en");
    }
  }, [pathname]);

  // ფოტოების ჩატვირთვა API-დან
  useEffect(() => {
    const fetchGalleryPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/gallery-photos");
        const result = await response.json();

        if (result.status === "success") {
          // დააჯგუფე ფოტოები კატეგორიების მიხედვით
          const photos = {
            exterior: result.data
              .filter(
                (photo) => photo.category === "exterior" && photo.is_active
              )
              .sort((a, b) => a.display_order - b.display_order),
            interior: result.data
              .filter(
                (photo) => photo.category === "interior" && photo.is_active
              )
              .sort((a, b) => a.display_order - b.display_order),
          };

          setGalleryPhotos(photos);
        }
      } catch (error) {
        console.error("Error fetching gallery photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryPhotos();
  }, []);

  const texts = {
    en: {
      title: "Gallery",
      exterior: "Exterior",
      interior: "Interior",
      loading: "Loading...",
      noPhotos: "No photos available in this category",
      comingSoon: "Coming soon",
    },
    ka: {
      title: "გალერეა",
      exterior: "ექსტერიერი",
      interior: "ინტერიერი",
      loading: "იტვირთება...",
      noPhotos: "ამ კატეგორიაში ფოტოები არ არის",
      comingSoon: "მალე დაემატება",
    },
  };

  const currentImages = galleryPhotos[activeCategory];
  const hasInteriorPhotos = galleryPhotos.interior.length > 0;

  // ფოტოზე დაჭერისას ორი შესაძლებლობა გვაქვს:
  // 1. გახსნას მოდალი (როგორც ახლა არის)
  // 2. გადავიდეს პროექტის ბმულზე
  const handleImageClick = (image, index) => {
    // თუ გვინდა გადასვლა პროექტის გვერდზე
    router.push(image.project_link);

    // თუ გვინდა მოდალის გახსნა, ეს კოდი იქნება
    // openModal(index);
  };

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
  }, [isModalOpen, currentImageIndex, currentImages]);

  return (
    <>
      <div className="mx-auto py-24">
        <h2 className="font-firago font-bold text-4xl text-center mb-4">
          {texts[currentLang].title}
        </h2>

        {/* კატეგორიის ფილტრი */}

        {pathname === "/en/projects/1/ortachala-hils" ||
        pathname === "/ka/projects/1/ortachala-hils" ? (
          // Only show the buttons when the pathname is "/"
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
              onClick={() => hasInteriorPhotos && setActiveCategory("interior")}
              className={`font-firago text-lg transition-colors ${
                !hasInteriorPhotos
                  ? "opacity-50 cursor-not-allowed"
                  : activeCategory === "interior"
                  ? "text-foreground font-medium hover:text-foreground"
                  : "text-muted-foreground font-light hover:text-foreground"
              }`}
              title={!hasInteriorPhotos ? texts[currentLang].comingSoon : ""}
            >
              {texts[currentLang].interior}
            </button>
          </div>
        ) : null}
        {/* ჩატვირთვის ინდიკატორი */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">{texts[currentLang].loading}</span>
          </div>
        ) : currentImages.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p>{texts[currentLang].noPhotos}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* პირველი სვეტი */}
            <div className="space-y-8">
              {currentImages.length > 0 && (
                <div className="w-full">
                  <div
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleImageClick(currentImages[0], 0)}
                  >
                    <CldImage
                      src={currentImages[0].image_path}
                      alt={currentImages[0].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                </div>
              )}

              {currentImages.length > 2 && (
                <div className="grid grid-cols-2 gap-8">
                  <div
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleImageClick(currentImages[1], 1)}
                  >
                    <CldImage
                      src={currentImages[1].image_path}
                      alt={currentImages[1].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                  <div
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleImageClick(currentImages[2], 2)}
                  >
                    <Image
                      src={currentImages[2].image_path}
                      alt={currentImages[2].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                </div>
              )}
            </div>

            {/* მეორე სვეტი */}
            <div className="space-y-8">
              {currentImages.length > 4 && (
                <div className="grid grid-cols-2 gap-8">
                  <div
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleImageClick(currentImages[3], 3)}
                  >
                    <CldImage
                      src={currentImages[3].image_path}
                      alt={currentImages[3].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                  <div
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleImageClick(currentImages[4], 4)}
                  >
                    <Image
                      src={currentImages[4].image_path}
                      alt={currentImages[4].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                </div>
              )}

              {currentImages.length > 5 && (
                <div
                  className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => handleImageClick(currentImages[5], 5)}
                >
                  <CldImage
                    src={currentImages[5].image_path}
                    alt={currentImages[5].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* მოდალი (თუ საჭიროა) */}
      {isModalOpen && selectedImage && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={closeModal}
        >
          {/* დახურვის ღილაკი */}
          <button
            className="absolute top-4 right-4 z-50 p-2 text-white hover:text-gray-300 transition-colors"
            onClick={closeModal}
          >
            <X className="w-8 h-8" />
          </button>

          {/* ნავიგაციის ღილაკები */}
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

          {/* სურათის კონტეინერი */}
          <div
            className={`relative w-full max-w-7xl mx-4 aspect-[16/9] transition-transform duration-300 ${
              isClosing ? "scale-95" : "scale-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <CldImage
              src={selectedImage.image_path}
              alt={selectedImage.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />

            {/* პროექტის ბმულზე გადასვლის ღილაკი (თუ გსურთ მოდალშიც გქონდეთ ბმული) */}
            <Link
              href={selectedImage.project_link}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 text-black px-4 py-2 rounded-lg shadow hover:bg-white transition-colors"
            >
              {currentLang === "ka" ? "პროექტის ნახვა" : "View Project"}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
