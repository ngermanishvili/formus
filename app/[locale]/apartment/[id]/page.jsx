"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header1 from "@/components/headers/Header1";
import LoadingOverlay from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ApartmentDetails = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("3D");
  const [isImageOpen, setIsImageOpen] = useState(false);

  const params = useParams();
  const apartmentId = params.id.split("-")[0];

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
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveView("2D")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${
                      activeView === "2D"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  2D ვიზუალი
                </button>
                <button
                  onClick={() => setActiveView("3D")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${
                      activeView === "3D"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  3D ვიზუალი
                </button>
              </div>

              {/* Image Container with Hover Effect */}
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100  group"
                onClick={() => setIsImageOpen(true)}
              >
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                      />
                    </svg>
                  </div>
                </div>
                <CldImage
                  src={activeView === "2D" ? data.home_2d : data.home_3d}
                  width={1920}
                  height={1080}
                  className="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-110"
                  alt={`${activeView} ვიზუალი`}
                  cloudName="formus"
                  quality={60}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {data.price && (
                <div className="mb-4 pb-4 border-b">
                  <div className="text-sm text-gray-500">ფასი</div>
                  <div className="text-2xl font-bold">${data.price}</div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start">
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

                <div className="space-y-3 mt-6">
                  {data.total_area > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-500">საერთო ფართი</div>
                      <div className="text-lg font-semibold">
                        {data.total_area} მ²
                      </div>
                    </div>
                  )}

                  {data.studio_area > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-500">სტუდიო</div>
                      <div className="text-lg font-semibold">
                        {data.studio_area} მ²
                      </div>
                    </div>
                  )}

                  {data.bedroom_area > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-500">საძინებელი</div>
                      <div className="text-lg font-semibold">
                        {data.bedroom_area} მ²
                      </div>
                    </div>
                  )}

                  {data.bedroom2_area > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-500">საძინებელი 2</div>
                      <div className="text-lg font-semibold">
                        {data.bedroom2_area} მ²
                      </div>
                    </div>
                  )}

                  {data.living_room_area > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-500">მისაღები</div>
                      <div className="text-lg font-semibold">
                        {data.living_room_area} მ²
                      </div>
                    </div>
                  )}

                  {data.bathroom_area > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-500">სველი წერტილი</div>
                      <div className="text-lg font-semibold">
                        {data.bathroom_area} მ²
                      </div>
                    </div>
                  )}

                  {data.bathroom2_area > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-500">
                        სველი წერტილი 2
                      </div>
                      <div className="text-lg font-semibold">
                        {data.bathroom2_area} მ²
                      </div>
                    </div>
                  )}

                  {data.balcony_area > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-500">აივანი</div>
                      <div className="text-lg font-semibold">
                        {data.balcony_area} მ²
                      </div>
                    </div>
                  )}

                  {data.balcony2_area > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-500">აივანი 2</div>
                      <div className="text-lg font-semibold">
                        {data.balcony2_area} მ²
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-[70vw] h-[70vh] bg-black/95 border-0 rounded-xl p-4 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={() => setIsImageOpen(false)}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image View Controls */}
          <div className="absolute left-4 top-4 z-50 flex gap-2">
            <button
              onClick={() => setActiveView("2D")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all
                ${
                  activeView === "2D"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                }`}
            >
              2D ვიზუალი
            </button>
            <button
              onClick={() => setActiveView("3D")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all
                ${
                  activeView === "3D"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                }`}
            >
              3D ვიზუალი
            </button>
          </div>

          {/* Image Container */}
          <div className="relative h-full w-full overflow-hidden">
            <CldImage
              src={activeView === "2D" ? data.home_2d : data.home_3d}
              width={1920}
              height={1080}
              className="object-contain w-full h-full"
              alt={`${activeView} ვიზუალი`}
              cloudName="formus"
              quality={60}
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApartmentDetails;
