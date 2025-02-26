"use client";
import Footer1 from "@/components/footers/Footer1";
import Hero from "@/components/homes/home-5/Hero";
import Faq from "@/components/homes/home-5/Faq";
import DownloadApp from "@/components/common/downloadApp/DownloadApp";
import Image from "next/image";
import Shape from "@/public/assets/shapes/home/3.png";
import GalleryGrid from "@/components/apartment/gallery";

//
export default function Page() {
  return (
    <>
      <main className="main font-normal">
        <Hero />
        <div className="relative">
          <Faq />

          <div className="absolute bottom-[-200px] sm:bottom-[-150px] md:bottom-[-180px] left-[90px] max-md:left-0 right-0 z-10 max-md:bottom-[-280px] ">
            <DownloadApp />
          </div>
          <div className="hidden lg:block absolute bottom-[200px] left-[-20px] z-0">
            <img
              src="/assets/shapes/news/3.png"
              alt="Decorative shape"
              className="mt-12 lg:w-[150px] xl:w-[150px] 2xl:w-[200px] min-[1900px]:w-[300px]"
            />
          </div>
        </div>
      </main>
      <div className="mt-12">
        <GalleryGrid />
      </div>
    </>
  );
}
