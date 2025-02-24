"use client";
import React, { useState } from "react";
import OrtachalaPolygon from "../(test)/testroute/(components)/ortachala-polygon";
import ApartmentFilters from "@/components/apartment/filters";
import Image from "next/image";
import FormusLogo from "@/public/assets/imgs/ortachala/formus.svg";

const ChooseApartment = () => {
  const [filteredPolygons, setFilteredPolygons] = useState([]);

  const handleFilterChange = (filterValues) => {
    // Your existing filter logic
    const filtered = []; // Replace with your actual filtering logic
    setFilteredPolygons(filtered);
  };

  return (
    <div className="min-h-[350px] md:h-screen w-full bg-black overflow-hidden">
      <main className="relative w-full h-full">
        <div className="absolute inset-0">
          <OrtachalaPolygon filteredPolygons={filteredPolygons} />
        </div>

        {/* Filters Container */}
        <div
          className=" lg:absolute xl:absolute 2xl:absolute md:absolute z-10
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
