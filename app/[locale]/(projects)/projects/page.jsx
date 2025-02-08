"use client";
import { useState, useEffect } from "react";
import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import Breadcumb from "@/components/service/Breadcumb";
import Services1 from "@/components/service/Services1";

export default function Page() {
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
      {isMobile ? <MobailHeader1 /> : <Header5 />}
      <main className="main">
        <Breadcumb />
        <Services1 />
      </main>
      <Footer1 />
    </>
  );
}
