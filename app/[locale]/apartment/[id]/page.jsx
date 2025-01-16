//app/apartments/%5Bid%5D/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header1 from "@/components/headers/Header1";
import LoadingOverlay from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ApartmentDetails = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const apartmentId = params.id.split("-")[0]; // მაინც აიღებს მხოლოდ პირველ ნაწილს (3)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/apartments/${apartmentId}`);
        const result = await response.json();

        if (result.status !== "success") {
          throw new Error(result.message);
        }

        setData(result.data);
      } catch (error) {
        console.error("Error fetching apartment data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500 text-white";
      case "sold":
        return "bg-red-500 text-white";
      case "reserved":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
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

  if (loading) return <LoadingOverlay />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header1 />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            უკან დაბრუნება
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    ბინა {data.apartment_number}
                  </h1>
                  <p className="text-gray-500">
                    ბლოკი {data.block_id}, სართული {data.floor}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full ${getStatusColor(
                    data.status
                  )}`}
                >
                  {getStatusText(data.status)}
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">
                  ბინის პარამეტრები
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">საერთო ფართი</div>
                    <div className="text-2xl font-semibold">
                      {data.total_area} მ²
                    </div>
                  </div>

                  {data.studio_area > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">სტუდიო</div>
                      <div className="text-2xl font-semibold">
                        {data.studio_area} მ²
                      </div>
                    </div>
                  )}

                  {data.bedroom_area > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">საძინებელი</div>
                      <div className="text-2xl font-semibold">
                        {data.bedroom_area} მ²
                      </div>
                    </div>
                  )}

                  {data.bedroom2_area > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">საძინებელი 2</div>
                      <div className="text-2xl font-semibold">
                        {data.bedroom2_area} მ²
                      </div>
                    </div>
                  )}

                  {data.living_room_area > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">მისაღები</div>
                      <div className="text-2xl font-semibold">
                        {data.living_room_area} მ²
                      </div>
                    </div>
                  )}

                  {data.bathroom_area > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">სველი წერტილი</div>
                      <div className="text-2xl font-semibold">
                        {data.bathroom_area} მ²
                      </div>
                    </div>
                  )}

                  {data.bathroom2_area > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">
                        სველი წერტილი 2
                      </div>
                      <div className="text-2xl font-semibold">
                        {data.bathroom2_area} მ²
                      </div>
                    </div>
                  )}

                  {data.balcony_area > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">აივანი</div>
                      <div className="text-2xl font-semibold">
                        {data.balcony_area} მ²
                      </div>
                    </div>
                  )}

                  {data.balcony2_area > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">აივანი 2</div>
                      <div className="text-2xl font-semibold">
                        {data.balcony2_area} მ²
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {data.polygon_coords && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                  ბინის მდებარეობა სართულზე
                </h2>
                <div className="relative w-full aspect-[1122/672]">
                  <svg
                    viewBox="0 0 1122 672"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <polygon
                      points={data.polygon_coords}
                      className={`
                        stroke-2
                        ${
                          data.status === "sold"
                            ? "fill-red-200 stroke-red-500"
                            : ""
                        }
                        ${
                          data.status === "reserved"
                            ? "fill-yellow-200 stroke-yellow-500"
                            : ""
                        }
                        ${
                          data.status === "available"
                            ? "fill-green-200 stroke-green-500"
                            : ""
                        }
                      `}
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                დამატებითი ინფორმაცია
              </h2>
              {data.price && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500">ფასი</div>
                  <div className="text-2xl font-bold">${data.price}</div>
                </div>
              )}
              {/* აქ შეგიძლია დაამატო სხვა დამატებითი ინფორმაცია */}
            </div>

            {data.status === "available" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">დაკავშირება</h2>
                <Button className="w-full" size="lg">
                  დაგვიკავშირდით
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetails;
