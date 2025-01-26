//app/choose-apartment/page.jsx
"use client";
import React from "react";
import OrtachalaPolygon from "../(test)/testroute/(components)/ortachala-polygon";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import ApartmentFilters from "@/components/apartment/filters";

const ChooseApartment = () => {
  const handleFilterChange = (filterValues) => {
    const filtered = polygons.filter((polygon) => {
      const floorMatch =
        polygon.floor >= filterValues.floor[0] &&
        polygon.floor <= filterValues.floor[1];
      const blockMatch =
        !filterValues.blockId || polygon.block_id === filterValues.blockId;

      // Filter by apartment properties
      const polygonApartments = apartments.filter(
        (apt) =>
          apt.floor.toString() === polygon.floor &&
          apt.block_id === polygon.block_id
      );

      const statusMatch =
        filterValues.status === "all" ||
        polygonApartments.some((apt) => apt.status === filterValues.status);

      const areaMatch = polygonApartments.some(
        (apt) =>
          apt.total_area >= filterValues.totalArea[0] &&
          apt.total_area <= filterValues.totalArea[1]
      );

      const priceMatch = polygonApartments.some(
        (apt) =>
          (!apt.price && filterValues.price[0] <= 50000) ||
          (apt.price >= filterValues.price[0] &&
            apt.price <= filterValues.price[1])
      );

      return floorMatch && blockMatch && statusMatch && areaMatch && priceMatch;
    });

    setFilteredPolygons(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header1 />
      <main className="flex-1 w-full relative">
        <OrtachalaPolygon />
        <div className="w-full gap-4 ">
          <span className="text-white text-2xl">აირჩიეთ ბინა</span>
          <ApartmentFilters onFilterChange={handleFilterChange} />
        </div>{" "}
      </main>
      <Footer1 />
    </div>
  );
};
export default ChooseApartment;
