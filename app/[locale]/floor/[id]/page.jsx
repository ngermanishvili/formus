//app/floor/%5Bid%5D/page.jsx
"use client";
import React, { useState, memo, useEffect } from "react";
import { useParams } from "next/navigation";
import Header1 from "@/components/headers/Header1";
import LoadingOverlay from "@/components/loader/loader";
import { useRouter } from "next/navigation"; // დავამატოთ ეს
const Polygon = memo(({ data, isHovered, onHover, onClick }) => {
  console.log("Polygon data:", data); // დებაგინგისთვის
  return (
    <g>
      <polygon
        points={data.polygon_coords}
        className={`
              fill-transparent stroke-gray-200
              transition-all duration-300 cursor-pointer
              ${
                isHovered
                  ? "fill-green-500/50 stroke-blue-500"
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
        onMouseEnter={() => onHover(data)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(data)} // გასწორებული ვერსია
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

const InfoPanel = memo(({ data }) => {
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
    <div className="w-full max-w-sm bg-gray-200 rounded-xl shadow-lg  border-black overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">
            ბინა {data.apartment_number}
          </h3>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(
              data.status
            )}`}
          >
            {getStatusText(data.status)}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <span className="text-lg">{data.total_area} მ²</span>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {data.studio_area > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">სტუდიო</div>
                <div className="text-lg font-medium text-gray-900">
                  {data.studio_area} მ²
                </div>
              </div>
            )}
            {data.bedroom_area > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">საძინებელი</div>
                <div className="text-lg font-medium text-gray-900">
                  {data.bedroom_area} მ²
                </div>
              </div>
            )}
            {data.bedroom2_area > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">საძინებელი 2</div>
                <div className="text-lg font-medium text-gray-900">
                  {data.bedroom2_area} მ²
                </div>
              </div>
            )}
            {data.living_room_area > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">მისაღები</div>
                <div className="text-lg font-medium text-gray-900">
                  {data.living_room_area} მ²
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {data.bathroom_area > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">სველი წერტილი</div>
                <div className="text-lg font-medium text-gray-900">
                  {data.bathroom_area} მ²
                </div>
              </div>
            )}
            {data.bathroom2_area > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">სველი წერტილი 2</div>
                <div className="text-lg font-medium text-gray-900">
                  {data.bathroom2_area} მ²
                </div>
              </div>
            )}
            {data.balcony_area > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">აივანი</div>
                <div className="text-lg font-medium text-gray-900">
                  {data.balcony_area} მ²
                </div>
              </div>
            )}
            {data.balcony2_area > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">აივანი 2</div>
                <div className="text-lg font-medium text-gray-900">
                  {data.balcony2_area} მ²
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const FloorDetails = () => {
  const router = useRouter();
  const params = useParams();
  const [floorData, setFloorData] = useState(null);
  const [hoveredApartment, setHoveredApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFloorData = async () => {
      try {
        setLoading(true);
        if (!params.id || params.id === "undefined") {
          throw new Error("სართულის ID არ არის მითითებული");
        }

        // ამოვიღოთ მხოლოდ ID ნაწილი URL-დან
        const floorId = params.id.split("-")[0];
        console.log("Fetching floor with ID:", floorId);

        const response = await fetch(`/api/buildings/floor/${floorId}`);
        const result = await response.json();

        if (result.status !== "success") {
          throw new Error(result.message || "შეცდომა მონაცემების მიღებისას");
        }

        setFloorData(result.data);
      } catch (error) {
        console.error("Error fetching floor data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchFloorData();
    }
  }, [params.id]);

  if (loading) return <LoadingOverlay />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!floorData) return null;

  const { floor, apartments } = floorData;

  const handlePolygonClick = (data) => {
    console.log("Clicked apartment data:", data);
    if (!data.apartment_id) {
      console.error("No apartment ID found in:", data);
      return;
    }
    // Create a slug for the apartment URL
    const slug = `${data.apartment_id}-apartment-${data.apartment_number}-floor-${data.floor}`;
    router.push(`/apartment/${slug}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header1 />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-grow bg-gray-800 rounded-xl shadow-sm border-black p-8">
            <div className="relative w-full max-w-[1122px] aspect-[1122/672] mx-auto">
              <img
                src={floor.floor_plan_url}
                alt={`Floor ${floor.floor_number} plan`}
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div className="absolute inset-0">
                <svg
                  viewBox="0 0 1122 672"
                  className="w-full h-full"
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
                      onHover={setHoveredApartment}
                      onClick={handlePolygonClick}
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>

          <div className="w-96 flex-shrink-0 transition-all duration-300">
            {hoveredApartment ? (
              <InfoPanel data={hoveredApartment} />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-black">
                <p className="text-gray-400 text-center">
                  აირჩიეთ ბინა გეგმაზე დეტალური ინფორმაციისთვის
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
