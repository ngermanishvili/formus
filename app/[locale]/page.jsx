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
      <Header5 />
      <main className="main font-normal">
        <Hero />
        <div className="relative">
          <Faq />
          <div className="absolute bottom-[-200px] sm:bottom-[-150px] md:bottom-[-180px] lg:bottom-[-200px] left-0 right-0 z-10">
            <DownloadApp />
          </div>
          <div className="absolute bottom-[-200px] sm:bottom-[-80px] md:bottom-[-80px] lg:bottom-[50px] left-[-20px] right-0 z-0">
            <Image
              src={Shape}
              alt="Decorative shape"
              width={200}
              height={200}
              className="mt-[50px]"
            />
          </div>
        </div>
      </main>
      <StickySocial />
      <Footer1 />
    </>
  );
}
