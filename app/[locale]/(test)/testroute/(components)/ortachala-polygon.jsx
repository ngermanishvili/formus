"use client";
import React, { useState, memo, useEffect } from "react";
import Header1 from "@/components/headers/Header1";
import { Card, CardContent } from "@/components/ui/card";
import LoadingOverlay from "@/components/loader/loader";
import { useRouter } from "next/navigation";

const IMAGES = {
  first:
    "https://res.cloudinary.com/ds9dsumwl/image/upload/v1736945106/ortachala_new-compressed_l3mi8b.png",
};

const VIEW_BOX = {
  first: "0 0 3906 2200",
};

const api = {
  getFloors: async (blockIds) => {
    try {
      const promises = blockIds.map((blockId) =>
        fetch(`/api/buildings/${blockId}/floors`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              // დავამატოთ block_id თითოეულ სართულს
              return data.data.map((floor) => ({
                ...floor,
                block_id: blockId,
              }));
            }
            throw new Error(data.message);
          })
      );
      const results = await Promise.all(promises);
      return results.flat();
    } catch (error) {
      console.error("Error fetching floors:", error);
      throw error;
    }
  },

  getApartments: async (blockId) => {
    try {
      const response = await fetch(`/api/buildings/${blockId}/apartments`);
      const data = await response.json();

      if (data.status === "success") {
        return data.data.map((apartment) => ({
          ...apartment,
          block_id: blockId,
        }));
      }
      throw new Error(data.message);
    } catch (error) {
      console.error("Error fetching apartments:", error);
      throw error;
    }
  },
};

const isSold = (status) => status === "გაყიდულია";

const Polygon = memo(({ data, isHovered, onHover, onClick }) => {
  const getHoverClass = () => {
    if (isSold(data.status)) {
      return "hover:fill-red-500/40 hover:stroke-red-500";
    }
    return "hover:fill-green-500/40 hover:stroke-green-500";
  };

  return (
    <g>
      <polygon
        points={data.points}
        title={data.title}
        className={`fill-transparent stroke-transparent ${getHoverClass()} stroke-2 transition-all duration-200 cursor-pointer`}
        onClick={() => onClick(data)}
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onHover(data, {
            x: e.clientX,
            y: e.clientY,
          });
        }}
        onMouseMove={(e) => {
          onHover(data, {
            x: e.clientX,
            y: e.clientY,
          });
        }}
        onMouseLeave={() => onHover(null)}
      />
      {isHovered && (
        <polygon
          points={data.points}
          className={`${
            isSold(data.status) ? "stroke-red-500" : "stroke-green-500"
          } stroke-2 fill-none animate-pulse`}
        />
      )}
    </g>
  );
});

const InfoCard = memo(({ data, apartments, position }) => {
  if (!position) return null;

  const floorApartments =
    apartments?.filter((apt) => {
      const isMatchingFloor = apt.floor.toString() === data.floor;
      const isMatchingBlock = apt.block_id === data.block_id;

      return isMatchingFloor && isMatchingBlock;
    }) || [];

  // სტატუსების დათვლა
  const statusCounts = {
    available: 0,
    sold: 0,
    reserved: 0,
  };

  floorApartments.forEach((apt) => {
    statusCounts[apt.status] = (statusCounts[apt.status] || 0) + 1;
  });

  const averageArea = floorApartments.length
    ? (
        floorApartments.reduce((sum, apt) => sum + Number(apt.total_area), 0) /
        floorApartments.length
      ).toFixed(1)
    : 0;

  return (
    <div
      className="fixed bg-black/80 backdrop-blur-sm rounded-lg p-4 
                border border-blue-500/50 shadow-xl z-50
                text-white min-w-[200px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 10}px`,
        transform: "translateY(-100%)",
      }}
    >
      <div className="text-lg font-bold mb-2">
        {data.block_id} ბლოკი, სართული {data.floor}
      </div>

      <div className="space-y-2">
        <div className="text-gray-300">სულ ბინა: {floorApartments.length}</div>

        <div className="text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-400">ხელმისაწვდომი:</span>
            <span className="text-gray-300">{statusCounts.available}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400">გაყიდული:</span>
            <span className="text-gray-300">{statusCounts.sold}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">დაჯავშნილი:</span>
            <span className="text-gray-300">{statusCounts.reserved}</span>
          </div>
        </div>

        <div className="text-gray-400 text-sm">
          საშუალო ფართი: {averageArea} მ²
        </div>
      </div>
    </div>
  );
});

const OrtachalaPolygon = () => {
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const blockIds = ["A", "B", "D"];

        const [floorsData, ...apartmentsData] = await Promise.all([
          api.getFloors(blockIds),
          ...blockIds.map((blockId) => api.getApartments(blockId)),
        ]);
        console.log(await api.getFloors(["A"]));

        setPolygons(floorsData);
        setApartments(apartmentsData.flat());
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // In OrtachalaPolygon.jsx
  const handlePolygonClick = (data) => {
    console.log("Clicked floor data:", data); // Debug log
    if (!data.id) {
      console.error("No floor ID found in:", data);
      return;
    }
    // ვქმნით slug-ს სადაც შევა ID და სართულის ნომერი
    const slug = `${data.id}-floor-${data.floor}-block-${data.block_id}`;
    router.push(`/floor/${slug}`);
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
            src={IMAGES.first}
            alt="Ortachala"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-full h-full">
              <svg
                className="w-full h-full"
                viewBox={VIEW_BOX.first}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: "auto" }}
              >
                {polygons.map((polygon) => {
                  // ვიყენებთ formattedFloors-ის ფორმატირებას API-დან
                  const polygonData = {
                    ...polygon,
                    id: polygon.id,
                    floor: polygon.floor,
                    block_id: polygon.block_id,
                    points: polygon.points,
                    title: polygon.title,
                  };

                  return (
                    <Polygon
                      key={polygonData.id}
                      data={polygonData}
                      isHovered={hoveredPolygon?.id === polygonData.id}
                      onHover={(data, position) => {
                        setHoveredPolygon(data);
                        setHoverPosition(position);
                      }}
                      onClick={handlePolygonClick}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
        {hoveredPolygon && (
          <InfoCard
            data={hoveredPolygon}
            apartments={apartments}
            position={hoverPosition}
          />
        )}
        {isLoading && <LoadingOverlay />}
      </div>
    </div>
  );
};

export default OrtachalaPolygon;
