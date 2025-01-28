"use client";
import React, { useState, memo, useEffect } from "react";
import { useParams } from "next/navigation";
import Header1 from "@/components/headers/Header1";
import LoadingOverlay from "@/components/loader/loader";
import { useRouter } from "next/navigation";
import RoomAreas from "../(components)/room-area";
import { CldImage } from "next-cloudinary";

const Polygon = memo(({ data, isHovered, onHover, onClick, isMobile }) => {
  const handleClick = () => {
    if (isMobile) {
      onHover(data); // On mobile, first click shows info
    } else {
      onClick(data); // On desktop, direct click navigates
    }
  };

  return (
    <g>
      <polygon
        points={data.polygon_coords}
        className={`
              fill-transparent stroke-gray-200
              transition-all duration-300 cursor-pointer
              ${
                isHovered
                  ? "fill-green-300/50 stroke-blue-500"
                  : "hover:fill-green-400/30 hover:stroke-blue-400"
              }
              ${
                data.status === "sold"
                  ? "stroke-red-400 hover:fill-red-400/10 hover:stroke-red-400"
                  : ""
              }
              ${
                data.status === "reserved"
                  ? "stroke-yellow-200 hover:fill-yellow-400/10 hover:stroke-yellow-400"
                  : ""
              }
            `}
        strokeWidth="1.5"
        onMouseEnter={() => !isMobile && onHover(data)}
        onMouseLeave={() => !isMobile && onHover(null)}
        onClick={handleClick}
      />
      {isHovered && (
        <polygon
          points={data.polygon_coords}
          className={`
              stroke-2 fill-none animate-pulse
              ${data.status === "sold" ? "stroke-red-500" : ""}
              ${data.status === "reserved" ? "stroke-yellow-500" : ""}
              ${data.status === "available" ? "stroke-green-500" : ""}
            `}
        />
      )}
    </g>
  );
});

const InfoPanel = memo(({ data, onViewDetails }) => {
  if (!data) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "sold":
        return "bg-red-500";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "ხელმისაწვდომი";
      case "sold":
        return "გაყიდული";
      case "reserved":
        return "დაჯავშნული";
      default:
        return "უცნობი";
    }
  };

  return (
    <div className="w-full bg-gray-200 rounded-xl shadow-lg overflow-hidden lg:max-w-sm">
      <div className="relative w-full">
        <CldImage
          src={data.photo_3d || data.photo_2d}
          width={400}
          height={600}
          alt={`Apartment ${data.apartment_number}`}
          className="w-full h-48 md:h-56 lg:h-48 object-cover"
          cloudName="formus"
          quality={50}
          loading="lazy"
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(
            data.status
          )}`}
        >
          {getStatusText(data.status)}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3">
          <div className="flex justify-between items-center text-lg text-white">
            <span className="font-bold">ბინა {data.apartment_number}</span>
            <span>{data.total_area} მ²</span>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-3">
        <RoomAreas data={data} />
        <button
          onClick={() => onViewDetails(data)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
        >
          დეტალურად ნახვა
        </button>
      </div>
    </div>
  );
});

const FloorDetails = () => {
  const router = useRouter();
  const params = useParams();
  const [floorData, setFloorData] = useState(null);
  const [hoveredApartment, setHoveredApartment] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is the lg breakpoint in Tailwind
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
          throw new Error("სართულის ID არ არის მითითებული");
        }

        const floorId = params.id.split("-")[0];
        const response = await fetch(`/api/buildings/floor/${floorId}`);
        const result = await response.json();

        if (result.status !== "success") {
          throw new Error(result.message || "შეცდომა მონაცემების მიღებისას");
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
  }, [params.id]);

  const handlePolygonClick = (data) => {
    if (!data.apartment_id) {
      console.error("No apartment ID found in:", data);
      return;
    }
    const slug = `${data.apartment_id}-apartment-${data.apartment_number}-floor-${data.floor}`;
    router.push(`/apartment/${slug}`);
  };

  if (loading) return <LoadingOverlay />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!floorData) return null;

  const { floor, apartments } = floorData;
  const displayedApartment = hoveredApartment || selectedApartment;

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header1 />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow bg-white rounded-xl shadow-sm border-black overflow-hidden">
            <div className="relative w-full h-full">
              <div
                className="relative w-full h-0"
                style={{ paddingBottom: "59.89%" }}
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
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 flex-shrink-0 transition-all duration-300">
            {displayedApartment ? (
              <InfoPanel
                data={displayedApartment}
                onViewDetails={handlePolygonClick}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-black">
                <p className="text-gray-400 text-center">
                  {isMobile ? "დააჭირეთ" : "გადაატარეთ მაუსი"} ბინას გეგმაზე
                  დეტალური ინფორმაციისთვის
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorDetails;
