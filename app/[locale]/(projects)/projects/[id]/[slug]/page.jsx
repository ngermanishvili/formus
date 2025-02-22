// app/[locale]/(services)/project-details/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import Header5 from "@/components/headers/Header5";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import DownloadApp from "@/components/common/downloadApp/DownloadApp";
import GreenSection from "@/components/ortachala/3d-photo";
import ProjectContent from "../../(components)/hero-content";
import GalleryComponent from "@/components/apartment/gallery";
import AboutOrtachala from "@/app/[locale]/about-ortachala/page";

export default function Page({ params }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <main className="main" style={{ maxWidth: "100vw", overflow: "hidden" }}>
        <div className="border-bottom"></div>
        <ProjectContent id={params.id} />
        <AboutOrtachala />
        <GreenSection />

        <GalleryComponent />
      </main>
    </>
  );
}
