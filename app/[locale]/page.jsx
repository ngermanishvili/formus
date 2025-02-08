"use client";
import { useState, useEffect } from "react";
import Footer1 from "@/components/footers/Footer1";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import Hero from "@/components/homes/home-5/Hero";
import Faq from "@/components/homes/home-5/Faq";
import DownloadApp from "@/components/common/downloadApp/DownloadApp";
import Image from "next/image";
import Shape from "@/public/assets/shapes/home/3.png";
import Header5 from "@/components/headers/Header5";

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {isMobile ? <MobailHeader1 /> : <Header5 />}
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
      <Footer1 />
    </>
  );
}
