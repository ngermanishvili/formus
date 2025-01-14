"use client";

import React, { useState, memo, useEffect } from "react";
import Header1 from "@/components/headers/Header1";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingOverlay from "@/components/loader/loader";

// API ფუნქციები
const api = {
  getFloors: async (blockId) => {
    try {
      const res = await fetch(`/api/buildings/${blockId}/floors`);
      const data = await res.json();
      if (data.status === "success") {
        return data.data;
      }
      throw new Error(data.message);
    } catch (error) {
      console.error("Error fetching floors:", error);
      throw error;
    }
  },
};

const Polygon = memo(({ data, isHovered, onHover, onClick }) => (
  <g>
    <polygon
      points={data.points}
      title={data.title}
      className="fill-transparent stroke-transparent hover:fill-blue-500/30 hover:stroke-blue-500 stroke-2 transition-all duration-200 cursor-pointer"
      onClick={() => onClick(data)}
      onMouseEnter={() => onHover(data)}
      onMouseLeave={() => onHover(null)}
    />
    {isHovered && (
      <polygon
        points={data.points}
        className="stroke-  -500 stroke-2 fill-none animate-pulse"
      />
    )}
  </g>
));

Polygon.displayName = "Polygon";

const InfoCard = memo(({ data }) => (
  <div
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
               bg-black/80 backdrop-blur-sm rounded-lg p-4 
               border border-blue-500/50 shadow-xl
               animate-fade-in text-white
               transition-all duration-200"
  >
    <div className="text-xl font-bold mb-2">{data.title}</div>
    <div className="text-blue-400 mb-1">{data.status}</div>
    <div className="text-gray-300">{data.area}</div>
  </div>
));

InfoCard.displayName = "InfoCard";

const OrtachalaPolygon = () => {
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const blockId = "D";
        const floorsData = await api.getFloors(blockId);
        setPolygons(floorsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePolygonClick = (data) => {
    console.log("Selected floor:", data);
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header1 />
        <div className="flex-grow flex items-center justify-center">
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-500">დაფიქსირდა შეცდომა: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-screen">
        <div className="relative w-full h-full">
          <img
            src="https://res.cloudinary.com/ds9dsumwl/image/upload/v1736874418/ortachala-mtavari-mb_sq959w.png"
            alt="Ortachala"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="relative w-full h-full"
              style={{ aspectRatio: "1.73/1" }}
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 4496 2596"
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: "auto" }}
              >
                {polygons.map((polygon) => (
                  <Polygon
                    key={polygon.floor_id}
                    data={polygon}
                    isHovered={hoveredPolygon?.floor_id === polygon.floor_id}
                    onHover={setHoveredPolygon}
                    onClick={handlePolygonClick}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
        {hoveredPolygon && <InfoCard data={hoveredPolygon} />}
        {isLoading && <LoadingOverlay />}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, -60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrtachalaPolygon;
