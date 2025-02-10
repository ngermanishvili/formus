"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header5 from "@/components/headers/Header5";
import LoadingOverlay from "@/components/loader/loader";
import { CldImage } from "next-cloudinary";
import FloorFilters from "@/components/apartment/floor-filters";
import Footer from "@/components/footers/Footer1";

const ApartmentDetails = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("3D");

  const params = useParams();
  const apartmentId = params.id.split("-")[0];

  const downloadPDF = async () => {
    try {
      const response = await fetch(
        `/api/generate-pdf?block=${data.block_id}&apartment=${data.apartment_number}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `apartment-${data.block_id}-${data.apartment_number}.pdf`;
      a.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

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

  if (loading) return <LoadingOverlay />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-white mt-[100px]">
      <Header5 />

      {/* Main Content with Centered FloorFilters */}
      <div className="container mx-auto px-4 relative  mb-8">
        {/* Centered FloorFilters */}
        <div className="flex justify-center w-full my-8">
          <FloorFilters />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-8">
          {/* Left Side - Image and Toggle */}
          <div>
            {/* View Toggle */}
            <div className=""></div>

            {/* Image */}
            <div className="relative  bg-white rounded-lg overflow-hidden">
              <CldImage
                src={activeView === "2D" ? data.home_2d : data.home_3d}
                width={800}
                height={800}
                className="object-contain w-full h-full"
                alt={`${activeView} visualization`}
                cloudName="formus"
                quality={80}
              />
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-8 lg:space-y-12 mt-8 lg:mt-[6rem]">
            {/* Apartment Info */}
            <h2 className="text-xl">
              <span className="font-bold">
                {activeView === "3D" ? "3D Render" : "2D Plan"}
              </span>
              <span className="text-gray-400 mx-2">|</span>
              <button
                onClick={() => setActiveView(activeView === "3D" ? "2D" : "3D")}
                className="text-gray-400 hover:text-[#91b48c] font-bold"
              >
                {activeView === "3D" ? "2D Plan" : "3D Render"}
              </button>
              <span className="text-gray-400 mx-2">|</span>
              <span className="text-gray-400">360°</span>
            </h2>
            <div className="flex items-start border-b border-gray-200">
              <div>
                <h3 className="text-base font-light gap-2">
                  Apartment
                  <span className="font-bold gap-2 mx-2 mt-1">
                    {data.apartment_number}
                  </span>
                </h3>
                <p className="font-normal mt-2">
                  Floor{" "}
                  <span className="font-bold text-base">{data.floor}</span>
                </p>
              </div>
              <div className="h-12 w-px bg-black mx-6" />
              <div>
                <h3 className="text-lg font-normal mb-1">Total Area</h3>
                <p className="text-base">{data.total_area} m²</p>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold mb-6">Features:</h3>
              <div className="space-y-4">
                {data.hall_area > 0 && (
                  <div className="flex gap-2">
                    <span className="text-base font-light">Hall /</span>
                    <span className="text-base">{data.hall_area} m²</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-base font-light">BLOCK /</span>
                  <span className="text-base">{data.block_id}</span>
                </div>

                {data.living_room_area > 0 && (
                  <div className="flex gap-2">
                    <span className="text-base font-light">Living Room /</span>
                    <span className="text-base">
                      {data.living_room_area} m²
                    </span>
                  </div>
                )}
                {data.bedroom_area > 0 && (
                  <div className="flex gap-2">
                    <span className="text-base font-light">Bedroom /</span>
                    <span className="text-base">{data.bedroom_area} m²</span>
                  </div>
                )}
                {data.bathroom_area > 0 && (
                  <div className="flex gap-2">
                    <span className="text-base font-light">WC /</span>
                    <span className="text-base">{data.bathroom_area} m²</span>
                  </div>
                )}
                {data.balcony_area > 0 && (
                  <div className="flex gap-2">
                    <span className="text-base font-light">Terrace /</span>
                    <span className="text-base">{data.balcony_area} m²</span>
                  </div>
                )}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadPDF}
              className="px-6 py-2.5 bg-[#91B48C] text-black text-sm 
           hover:bg-[#91B48C]/90 transition-colors uppercase 
           rounded-lg font-medium"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApartmentDetails;
