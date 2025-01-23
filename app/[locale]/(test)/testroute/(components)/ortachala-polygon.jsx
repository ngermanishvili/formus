"use client";
import React, { useState, memo, useEffect } from "react";
import Header1 from "@/components/headers/Header1";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

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
      return `
        hover:fill-red-500/40 
        hover:stroke-red-500 
        stroke-[1.5]
        lg:stroke-[1]
      `;
    }
    return `
      hover:fill-green-500/40 
      hover:stroke-green-500 
      stroke-[1.5]
      lg:stroke-[1]
    `;
  };

  const handleClick = () => {
    onClick(data);
  };

  return (
    <g>
      <polygon
        points={data.points}
        title={data.title}
        className={`
          fill-transparent 
          stroke-white/30
          lg:stroke-transparent
          ${getHoverClass()}
          transition-all duration-200 
          cursor-pointer
          active:stroke-white/50
          active:fill-white/20
        `}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (window.innerWidth > 1024) {
            onHover(data, {
              x: e.clientX,
              y: e.clientY,
            });
          }
        }}
        onMouseMove={(e) => {
          if (window.innerWidth > 1024) {
            onHover(data, {
              x: e.clientX,
              y: e.clientY,
            });
          }
        }}
        onMouseLeave={() => {
          if (window.innerWidth > 1024) {
            onHover(null);
          }
        }}
      />
      {isHovered && (
        <polygon
          points={data.points}
          className={`
            ${isSold(data.status) ? "stroke-red-500" : "stroke-green-500"}
            stroke-2 
            fill-none 
            animate-pulse
            lg:animate-none
          `}
        />
      )}
    </g>
  );
});

const InfoCard = memo(({ data, apartments, position }) => {
  if (!data) return null;

  const floorApartments =
    apartments?.filter((apt) => {
      const isMatchingFloor = apt.floor.toString() === data.floor;
      const isMatchingBlock = apt.block_id === data.block_id;
      return isMatchingFloor && isMatchingBlock;
    }) || [];

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

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

  if (isMobile) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg z-50 
                    border-t border-blue-500/50 shadow-xl animate-slide-up"
      >
        <div className="max-w-3xl mx-auto">
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* სათაური */}
              <div className="col-span-2 md:col-span-4">
                <h3 className="text-lg md:text-xl font-bold text-white">
                  {data.block_id} ბლოკი, სართული {data.floor}
                </h3>
              </div>

              {/* სტატისტიკა */}
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm text-gray-400">სულ ბინა</div>
                <div className="text-lg font-semibold text-white">
                  {floorApartments.length}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm text-gray-400">ხელმისაწვდომი</div>
                <div className="text-lg font-semibold text-green-400">
                  {statusCounts.available}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm text-gray-400">გაყიდული</div>
                <div className="text-lg font-semibold text-red-400">
                  {statusCounts.sold}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm text-gray-400">საშუალო ფართი</div>
                <div className="text-lg font-semibold text-blue-400">
                  {averageArea} მ²
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version remains the same with hover behavior
  return (
    <div
      className="fixed bg-black/90 backdrop-blur-sm rounded-lg p-4 
                border border-blue-500/50 shadow-xl z-50
                text-white min-w-[240px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 10}px`,
        transform: "translateY(-100%)",
      }}
    >
      <div className="text-lg font-bold mb-3">
        {data.block_id} ბლოკი, სართული {data.floor}
      </div>

      <div className="space-y-2">
        <div className="text-gray-300">სულ ბინა: {floorApartments.length}</div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">ხელმისაწვდომი:</span>
            <span className="text-green-400 font-medium">
              {statusCounts.available}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">გაყიდული:</span>
            <span className="text-red-400 font-medium">
              {statusCounts.sold}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">დაჯავშნილი:</span>
            <span className="text-yellow-400 font-medium">
              {statusCounts.reserved}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">საშუალო ფართი:</span>
            <span className="text-blue-400 font-medium">{averageArea} მ²</span>
          </div>
        </div>
      </div>
    </div>
  );
});
const OrtachalaPolygon = () => {
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
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

  const handlePolygonClick = (data) => {
    if (!data.id) {
      console.error("No floor ID found in:", data);
      return;
    }
    const slug = `${data.id}-floor-${data.floor}-block-${data.block_id}`;
    router.push(`/floor/${slug}`);
  };

  const handleMobileClick = (data) => {
    setSelectedPolygon(data);
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
    <div className="relative w-full">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full h-full relative overflow-hidden">
          <CldImage
            src={IMAGES.first}
            width={3906}
            height={2200}
            alt="Ortachala"
            className="w-full h-full object-contain md:object-cover"
            cloudName="formus"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-full h-full"
              viewBox={VIEW_BOX.first}
              preserveAspectRatio="xMidYMid meet"
            >
              {polygons.map((polygon) => (
                <Polygon
                  key={polygon.id}
                  data={polygon}
                  isHovered={hoveredPolygon?.id === polygon.id}
                  onHover={(data, position) => {
                    const isMobile = window.innerWidth <= 1024;
                    if (!isMobile) {
                      setHoveredPolygon(data);
                      setHoverPosition(position);
                    }
                  }}
                  onClick={(data) => {
                    const isMobile = window.innerWidth <= 1024;
                    if (isMobile) {
                      handleMobileClick(data);
                    } else {
                      handlePolygonClick(data);
                    }
                  }}
                />
              ))}
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
      {selectedPolygon && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSelectedPolygon(null)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg z-50 
                border-t border-blue-500/50 shadow-xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-3xl mx-auto relative">
              <button
                onClick={() => setSelectedPolygon(null)}
                className="absolute top-2 right-2 text-white/60 hover:text-white p-2"
              >
                ✕
              </button>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2 md:col-span-4">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      {selectedPolygon.block_id} ბლოკი, სართული{" "}
                      {selectedPolygon.floor}
                    </h3>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">სულ ბინა</div>
                    <div className="text-lg font-semibold text-white">
                      {
                        apartments.filter(
                          (apt) =>
                            apt.floor.toString() === selectedPolygon.floor &&
                            apt.block_id === selectedPolygon.block_id
                        ).length
                      }
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">ხელმისაწვდომი</div>
                    <div className="text-lg font-semibold text-green-400">
                      {
                        apartments.filter(
                          (apt) =>
                            apt.floor.toString() === selectedPolygon.floor &&
                            apt.block_id === selectedPolygon.block_id &&
                            apt.status === "available"
                        ).length
                      }
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">გაყიდული</div>
                    <div className="text-lg font-semibold text-red-400">
                      {
                        apartments.filter(
                          (apt) =>
                            apt.floor.toString() === selectedPolygon.floor &&
                            apt.block_id === selectedPolygon.block_id &&
                            apt.status === "sold"
                        ).length
                      }
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm text-gray-400">საშუალო ფართი</div>
                    <div className="text-lg font-semibold text-blue-400">
                      {(
                        apartments
                          .filter(
                            (apt) =>
                              apt.floor.toString() === selectedPolygon.floor &&
                              apt.block_id === selectedPolygon.block_id
                          )
                          .reduce(
                            (sum, apt) => sum + Number(apt.total_area),
                            0
                          ) /
                          apartments.filter(
                            (apt) =>
                              apt.floor.toString() === selectedPolygon.floor &&
                              apt.block_id === selectedPolygon.block_id
                          ).length || 0
                      ).toFixed(1)}{" "}
                      მ²
                    </div>
                  </div>
                </div>
                {/* Add this new button section */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      handlePolygonClick(selectedPolygon);
                      setSelectedPolygon(null);
                    }}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg
                        transition-colors duration-200 flex items-center justify-center"
                  >
                    დეტალების ნახვა
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrtachalaPolygon;
