"use client";

import SearchForm from "@/components/search/search-form";
import { usePathname } from "next/navigation";

export default function DownloadApp() {
  const pathname = usePathname();
  const chooseHomeText =
    pathname === "/ka" ? "შეარჩიეთ ბინა" : "Choose an Apartment";

  return (
    <div className="flex justify-center items-center my-[30px] sm:my-[40px] lg:my-[85px] px-4 sm:px-6 lg:px-8">
      <section
        className="min-h-[180px] w-full sm:min-h-[220px] lg:min-h-[250px] sm:w-[980px] sm:ml-[-100px] 
        rounded-2xl  max-w-full  bg-[#abc188] 
        relative overflow-hidden"
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 hidden sm:block"></div>
        <div className="container mx-auto px-3 py-8 sm:px-4 sm:py-16 lg:py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2
              className="text-2xl sm:text-4xl lg:text-5xl font-bold text-black mb-6 sm:mb-10 lg:mb-12 
              animate-fade-in"
            >
              {chooseHomeText}
            </h2>
            <div className="p-3 sm:p-6 lg:p-8 rounded-2xl relative">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
