// app/[locale]/(services)/project-details/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import ProjectContent from "../../(components)/hero-content";
import GalleryComponent from "@/components/apartment/gallery";
import AboutOrtachala from "@/app/[locale]/about-ortachala/page";
import GreenSection from "@/components/ortachala/3d-photo";

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

  const isOrtachalaHills = params.id === "1";

  return (
    <>
      <main className="main" style={{ maxWidth: "100vw", overflow: "hidden" }}>
        <div className="border-bottom"></div>
        <ProjectContent id={params.id} />

        {isOrtachalaHills && (
          <>
            <AboutOrtachala />
            <GreenSection />
          </>
        )}

        {isOrtachalaHills && <GalleryComponent />}
      </main>
    </>
  );
}
