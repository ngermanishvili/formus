// app/[locale]/(services)/project-details/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import ProjectContent from "../../(components)/hero-content";
import AboutProject from "../../(components)/about-project";

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

        <AboutProject projectId={params.id} />
      </main>
    </>
  );
}
