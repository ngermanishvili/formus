"use client";
import React from "react";
import OrtachalaPolygon from "../(test)/testroute/(components)/ortachala-polygon";
import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import ApartmentFilters from "@/components/apartment/filters";

const ChooseApartment = () => {
  const handleFilterChange = (filterValues) => {
    const filtered = polygons.filter((polygon) => {
      const floorMatch =
        polygon.floor >= filterValues.floor[0] &&
        polygon.floor <= filterValues.floor[1];
      const blockMatch =
        !filterValues.blockId || polygon.block_id === filterValues.blockId;

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
    <div className="flex flex-col h-screen bg-black">
      <Header5 />
      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <OrtachalaPolygon />
        </div>
        <div className="absolute left-[500px] top-[100px] right-4 z-10">
          <ApartmentFilters onFilterChange={handleFilterChange} />
        </div>
      </main>
      <Footer1 />
    </div>
  );
};

export default ChooseApartment;
