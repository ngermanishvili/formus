"use client";
import BreadCumb from "@/components/contact/BreadCumb";
import { useState, useEffect } from "react";
import Map from "@/components/contact/Map";
import Offices from "@/components/contact/Offices";
import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import MobailHeader1 from "@/components/headers/MobailHeader1";

export default function page() {
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
        <BreadCumb />
        <Offices />
        <Map />
      </main>
      <Footer1 />
    </>
  );
}
