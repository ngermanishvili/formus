"use client";
import React, { useState, memo, useEffect } from "react";
import Header1 from "@/components/headers/Header1";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ApartmentFilters from "@/components/apartment/filters";
import FormusLogo from "@/public/assets/imgs/ortachala/formus.svg";
import Image from "next/image";

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

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.status === "success") {
        return data.data.map((apartment) => ({
          ...apartment,
          block_id: blockId,
        }));
      }
      throw new Error(data.message || "Error fetching apartments");
    } catch (error) {
      console.error(`Error fetching apartments for block ${blockId}:`, error);
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
    hover:fill-[#FBB200]/40 
    hover:stroke-[#FBB200] 
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
            ${isSold(data.status) ? "stroke-red-500" : "stroke-[#FBB200]"}
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

const InfoCard = memo(({ data, position }) => {
  if (!data) return null;

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

  if (isMobile) {
    return null;
  }

  return (
    <div
      className="fixed bg-[#FBB200] rounded-lg shadow-xl z-50 
                p-2 min-w-[160px] text-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 10}px`,
        transform: "translateY(-100%)",
      }}
    >
      <div className="flex items-center justify-center gap-4">
        <div>
          <div className="text-[10px] text-black/60">Floor</div>
          <div className="text-5xl font-bold text-black">{data.floor}</div>
        </div>

        <div className="w-px h-[50px] bg-black/20" />
        <div>
          <div className="text-[10px] text-black/60">Block</div>
          <div className="text-5xl  font-bold text-black">{data.block_id}</div>
        </div>
      </div>
    </div>
  );
});

const Controls = ({ zoomIn, zoomOut, resetTransform }) => {
  const handleZoomIn = () => zoomIn(0.3);
  const handleZoomOut = () => zoomOut(0.3);

  return (
    <div className="relative  right-6 z-40 flex  gap-2">
      <div className="backdrop-blur-xl absolute rounded-md   shadow-md p-1.5 bottom-[-350px] right-0 ">
        <div className="flex gap-1">
          <button
            onClick={handleZoomIn}
            className="p-3 rounded-xl bg-gradient-to-tr from-white/5 to-white/10
                     active:from-purple-500/20 active:to-blue-500/20
                     transition-all duration-200"
            aria-label="Zoom in"
          >
            <Plus
              size={20}
              className="text-white/90 transform active:scale-95
                       transition-transform duration-200"
            />
          </button>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <button
            onClick={handleZoomOut}
            className="p-3 rounded-xl bg-gradient-to-tr from-white/5 to-white/10
                     active:from-purple-500/20 active:to-blue-500/20
                     transition-all duration-200"
            aria-label="Zoom out"
          >
            <Minus
              size={20}
              className="text-white/90 transform active:scale-95
                       transition-transform duration-200"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
const MobileView = ({ children }) => {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={1} // ეს იყო 0.5, ვზრდით 1-მდე
      maxScale={4}
      limitToBounds={true} // ეს იყო false
      wheel={{ disabled: true }}
      doubleClick={{ disabled: true }}
    >
      {(utils) => (
        <>
          <Controls {...utils} />
          <TransformComponent
            wrapperClassName="!w-full !h-full"
            contentClassName="!w-full !h-full"
          >
            {children}
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

const DesktopView = ({ children }) => {
  return children;
};

const OrtachalaPolygon = () => {
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const [filteredPolygons, setFilteredPolygons] = useState([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const content = (
    <>
      <div className="relative w-full h-full flex items-center justify-center md:mt-0 mt-[50px]">
        <div className="w-full h-full relative overflow-hidden">
          <CldImage
            src={IMAGES.first}
            width={3906}
            height={2200}
            quality={100}
            alt="Ortachala"
            className="w-full h-full object-contain md:object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-full h-full"
              viewBox={VIEW_BOX.first}
              preserveAspectRatio="xMidYMid meet"
            >
              {(filteredPolygons.length > 0 ? filteredPolygons : polygons).map(
                (polygon) => (
                  <Polygon
                    key={polygon.id}
                    data={polygon}
                    isHovered={hoveredPolygon?.id === polygon.id}
                    onHover={(data, position) => {
                      if (!isMobile) {
                        setHoveredPolygon(data);
                        setHoverPosition(position);
                      }
                    }}
                    onClick={(data) => {
                      if (isMobile) {
                        handleMobileClick(data);
                      } else {
                        handlePolygonClick(data);
                      }
                    }}
                  />
                )
              )}
            </svg>
          </div>
        </div>
      </div>
    </>
  );
  useEffect(() => {
    if (selectedPolygon) {
      console.log("Selected polygon state updated:", selectedPolygon);
    }
  }, [selectedPolygon]);

  return (
    <div className="relative w-full">
      {isMobile ? (
        <MobileView>{content}</MobileView>
      ) : (
        <DesktopView>{content}</DesktopView>
      )}

      {hoveredPolygon && (
        <InfoCard
          data={hoveredPolygon}
          apartments={apartments}
          position={hoverPosition}
        />
      )}
      {selectedPolygon && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          onClick={() => setSelectedPolygon(null)}
        >
          <div
            className="fixed bottom-0 left-0 right-0
                lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 
                bg-black/95 backdrop-blur-lg z-[101] 
                border-t border-blue-500/50 lg:border
                lg:rounded-xl w-full lg:max-w-2xl
                transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 w-full bg-black/95 pt-2 px-2">
                <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-2 lg:hidden" />
                <button
                  onClick={() => setSelectedPolygon(null)}
                  className="absolute top-2 right-2 text-white/60 hover:text-white p-2"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                  <div className="col-span-2 lg:col-span-4">
                    <h3 className="text-lg lg:text-xl font-bold text-white">
                      {selectedPolygon.block_id} ბლოკი, სართული{" "}
                      {selectedPolygon.floor}
                    </h3>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 lg:p-4">
                    <div className="text-xs lg:text-sm text-gray-400">
                      სულ ბინა
                    </div>
                    <div className="text-base lg:text-lg font-semibold text-white">
                      {
                        apartments.filter(
                          (apt) =>
                            apt.floor.toString() === selectedPolygon.floor &&
                            apt.block_id === selectedPolygon.block_id
                        ).length
                      }
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 lg:p-4">
                    <div className="text-xs lg:text-sm text-gray-400">
                      ხელმისაწვდომი
                    </div>
                    <div className="text-base lg:text-lg font-semibold text-green-400">
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

                  <div className="bg-white/10 rounded-lg p-3 lg:p-4">
                    <div className="text-xs lg:text-sm text-gray-400">
                      გაყიდული
                    </div>
                    <div className="text-base lg:text-lg font-semibold text-red-400">
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

                  <div className="bg-white/10 rounded-lg p-3 lg:p-4">
                    <div className="text-xs lg:text-sm text-gray-400">
                      საშუალო ფართი
                    </div>
                    <div className="text-base lg:text-lg font-semibold text-blue-400">
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

                <div className="mt-4 lg:mt-6 pb-4">
                  <button
                    onClick={() => {
                      const slug = `${selectedPolygon.id}-floor-${selectedPolygon.floor}-block-${selectedPolygon.block_id}`;
                      router.push(`/floor/${slug}`);
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
