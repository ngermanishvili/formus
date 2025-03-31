"use client";
import React, { useState, useEffect } from "react";
import OrtachalaPolygon from "../(test)/testroute/(components)/ortachala-polygon";
import ApartmentFilters from "@/components/apartment/filters";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import FormusLogo from "@/public/assets/imgs/ortachala/formus.svg";

const ChooseApartment = () => {
  const router = useRouter();
  const locale = useLocale();
  const [filteredPolygons, setFilteredPolygons] = useState([]);
  const [filters, setFilters] = useState({
    floors: [],
    blocks: [],
    statuses: [],
  });

  const handleFilterChange = (newFilters) => {
    console.log("Filters changed:", newFilters);
    setFilters(newFilters);

    // If filters are applied, navigate to homes-list page
    if (Object.values(newFilters).some((arr) => arr.length > 0)) {
      const queryParams = new URLSearchParams();

      if (newFilters.floors.length) {
        queryParams.set("floors", newFilters.floors.join(","));
      }
      if (newFilters.blocks.length) {
        queryParams.set("blocks", newFilters.blocks.join(","));
      }
      if (newFilters.statuses.length) {
        queryParams.set("statuses", newFilters.statuses.join(","));
      }

      router.push(`/${locale}/homes-list?${queryParams.toString()}`);
    }
  };

  return (
    <div className="min-h-[350px] md:h-screen w-full bg-black overflow-hidden">
      <main className="relative w-full h-full">
        <div className="absolute inset-0">
          <OrtachalaPolygon filteredPolygons={filteredPolygons} />
        </div>

        {/* Filters Container */}
        <div
          className="lg:absolute xl:absolute 2xl:absolute md:absolute z-10
            w-full px-4
            sm:w-auto sm:right-4 sm:px-0
            md:left-[30%] md:transform md:-translate-x-1/2
            lg:left-[35%] lg:transform-none
            xl:left-[25%]
            2xl:left-[30%]
            md:top-[100px]
            xl:top-[100px]
            lg:top-[100px]
            "
        >
          <ApartmentFilters onFilterChange={handleFilterChange} />
        </div>
      </main>
    </div>
  );
};

export default ChooseApartment;
