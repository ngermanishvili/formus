"use client";
import Footer1 from "@/components/footers/Footer1";
import Hero from "@/components/homes/home-5/Hero";
import Faq from "@/components/homes/home-5/Faq";
import DownloadApp from "@/components/common/downloadApp/DownloadApp";
import Image from "next/image";
import Shape from "@/public/assets/shapes/home/3.png";
import Header5 from "@/components/headers/Header5";
import StickySocial from "@/components/socials/sticky-socials";

//
export default function Page() {
  return (
    <>
      <main className="main font-normal">
        <Hero />
        <div className="relative">
          <Faq />
          <div className="absolute bottom-[-200px] sm:bottom-[-150px] md:bottom-[-180px] lg:bottom-[-300px] left-[90px] max-md:left-0 right-0 z-10 max-md:bottom-[-280px] ">
            <DownloadApp />
          </div>
          <div className="absolute bottom-[-200px] sm:bottom-[-80px] md:bottom-[-80px] lg:bottom-[50px] left-[-20px] right-0 z-0 xl-w-[300px] xl-w-[300px] 4xl-w-[400px] 4xl-h-[600px]">
            <Image
              src={Shape}
              alt="Decorative shape"
              width={200}
              height={200}
              className="mt-[50px] xl-w-[300px] xl-w-[300px] 2xl-w-[400px] 2xl-h-[600px] max-[800px]:hidden"
            />
          </div>
        </div>
      </main>
    </>
  );
}
