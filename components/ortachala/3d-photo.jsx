"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import GreenSectionShape from "@/public/assets/shapes/project/4.png";

export default function GreenSection() {
  const pathname = usePathname();
  const currentLang = pathname.includes("/ka") ? "ka" : "en";

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[500px] bg-[#ABC188] py-16 px-4 overflow-hidden">
      <div className="container mx-auto max-w-4xl text-center mb-12 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
          {currentLang === "ka" ? "მზის ლოკაცია" : "Sun Location"}
        </h2>

        <div className="relative w-full h-[300px] md:h-[500px] mx-auto">
          <Image
            src="https://i.ibb.co/4wnf6qcW/ORTACHALA-HILLS-3.gif"
            alt={currentLang === "ka" ? "მზის ლოკაცია" : "Sun Location"}
            fill
            unoptimized
            className="object-cover rounded-3xl shadow-xl "
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw "
          />
        </div>
      </div>

      {/* Decorative Shape */}
      <div className="absolute bottom-0 left-0 w-[100px] sm:w-[150px] md:w-[200px] lg:w-[250px] xl:w-[300px] pointer-events-none z-0">
        <Image
          src={GreenSectionShape}
          alt="Decorative Shape"
          className="object-contain"
        />
      </div>
    </section>
  );
}
