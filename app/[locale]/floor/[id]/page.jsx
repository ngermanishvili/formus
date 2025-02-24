"use client";
import React, { useState, memo, useEffect } from "react";
import { useParams } from "next/navigation";
import LoadingOverlay from "@/components/loader/loader";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import RoomAreas from "../(components)/room-area";
import { CldImage } from "next-cloudinary";
import FloorFilters from "@/components/apartment/floor-filters";
import Header5 from "@/components/headers/Header5";

const translations = {
  en: {
    chooseApartment: "Choose Apartment",
    sold: "Sold",
    floorError: "Floor ID is not specified",
    dataError: "Error receiving data",
  },
  ka: {
    chooseApartment: "შეარჩიეთ ბინა",
    sold: "გაყიდულია",
    floorError: "სართულის ID არ არის მითითებული",
    dataError: "შეცდომა მონაცემების მიღებისას",
  },
};

const Polygon = memo(({ data, isHovered, onHover, onClick, isMobile, t }) => {
  const getCenterPoint = (coords) => {
    const points = coords.split(" ").map((point) => {
      const [x, y] = point.split(",").map(Number);
      return { x, y };
    });

    const xSum = points.reduce((sum, point) => sum + point.x, 0);
    const ySum = points.reduce((sum, point) => sum + point.y, 0);

    return {
      x: xSum / points.length,
      y: ySum / points.length,
    };
  };

  const center = getCenterPoint(data.polygon_coords);

  const handleClick = () => {
    onClick(data);
  };

  return (
    <g>
      <polygon
        points={data.polygon_coords}
        className={`
          fill-transparent 
          transition-all duration-300 cursor-pointer
          ${
            isHovered && data.status === "sold"
              ? "fill-red-500/40 stroke-red-600 stroke-[3px]"
              : isHovered
              ? "fill-green-300/50 stroke-blue-500"
              : data.status === "sold"
              ? "stroke-red-400 hover:fill-red-400/30 hover:stroke-red-500 stroke-[2px]"
              : data.status === "reserved"
              ? "stroke-yellow-200 hover:fill-yellow-400/10 hover:stroke-yellow-400"
              : "stroke-gray-200 hover:fill-green-400/30 hover:stroke-blue-400"
          }
        `}
        strokeWidth="1.5"
        onMouseEnter={() => !isMobile && onHover(data)}
        onMouseLeave={() => !isMobile && onHover(null)}
        onClick={handleClick}
      />

      {/* Sold Status Text */}
      {data.status === "sold" && (
        <text
          x={center.x}
          y={center.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`
            text-sm fill-red-500 font-semibold pointer-events-none
            ${isHovered ? "opacity-100" : "opacity-80"}
          `}
          style={{
            textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)",
          }}
        >
          {t.sold}
        </text>
      )}

      {isHovered && (
        <polygon
          points={data.polygon_coords}
          className={`
            stroke-2 fill-none animate-pulse
            ${
              data.status === "sold"
                ? "stroke-red-500 stroke-[3px]"
                : data.status === "reserved"
                ? "stroke-yellow-500"
                : "stroke-green-500"
            }
          `}
        />
      )}
    </g>
  );
});

const FloorDetails = () => {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const t = translations[locale];

  const [floorData, setFloorData] = useState(null);
  const [hoveredApartment, setHoveredApartment] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!params.id || params.id === "undefined") {
          throw new Error(t.floorError);
        }

        const floorId = params.id.split("-")[0];
        const response = await fetch(`/api/buildings/floor/${floorId}`);
        const result = await response.json();

        if (result.status !== "success") {
          throw new Error(result.message || t.dataError);
        }

        const apartmentResponses = await Promise.all(
          result.data.apartments.map((apt) =>
            fetch(`/api/apartments/${apt.apartment_id}`).then((res) =>
              res.json()
            )
          )
        );

        const updatedApartments = result.data.apartments.map((apt, index) => ({
          ...apt,
          photo_2d: apartmentResponses[index]?.data?.home_2d || null,
          photo_3d: apartmentResponses[index]?.data?.home_3d || null,
        }));

        setFloorData({
          ...result.data,
          apartments: updatedApartments,
        });
        setSelectedApartment(updatedApartments[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, t]);

  const handlePolygonClick = (data) => {
    if (!data.apartment_id) {
      console.error("No apartment ID found in:", data);
      return;
    }
    const slug = `${data.apartment_id}-apartment-${data.apartment_number}-floor-${data.floor}`;
    router.push(`/${locale}/apartment/${slug}`);
  };

  if (loading) return <LoadingOverlay />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!floorData) return null;

  const { floor, apartments } = floorData;
  const displayedApartment = hoveredApartment || selectedApartment;

  return (
    <>
      <Header5 />
      <div className="flex flex-col mt-[100px]">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-3xl mx-auto mb-6">
            <FloorFilters />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">
            {t.chooseApartment}
          </h2>
          <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
            <div className="flex-grow bg-gray-200 rounded-xl shadow-sm border-black overflow-hidden">
              <div className="relative w-full h-full">
                <div
                  className="relative w-full h-auto"
                  style={{ paddingBottom: "59%" }}
                >
                  <div className="absolute inset-0">
                    <CldImage
                      width={1122}
                      height={672}
                      src={floor.floor_plan_url}
                      alt={`Floor ${floor.floor_number}`}
                      cloudName="formus"
                      className="w-full h-full object-contain"
                      quality={50}
                      loading="lazy"
                    />

                    <svg
                      viewBox={
                        floor.block_id === "D"
                          ? "690 0 2000 2000"
                          : "0 0 1122 672"
                      }
                      className="absolute inset-0 w-full h-full"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {apartments.map((apartment) => (
                        <Polygon
                          key={apartment.apartment_id}
                          data={apartment}
                          isHovered={
                            hoveredApartment?.apartment_id ===
                            apartment.apartment_id
                          }
                          onHover={(data) => {
                            setHoveredApartment(data);
                            if (data) setSelectedApartment(data);
                          }}
                          onClick={handlePolygonClick}
                          isMobile={isMobile}
                          t={t}
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloorDetails;
