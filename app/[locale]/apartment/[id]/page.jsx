"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Header5 from "@/components/headers/Header5";
import LoadingOverlay from "@/components/loader/loader";
import { CldImage } from "next-cloudinary";
import FloorFilters from "@/components/apartment/floor-filters";
import Footer from "@/components/footers/Footer1";

const translations = {
  en: {
    features: "Features:",
    hall: "Hall",
    block: "BLOCK",
    livingRoom: "Living Room",
    bedroom: "Bedroom",
    wc: "WC",
    terrace: "Terrace",
    apartment: "Apartment",
    floor: "Floor",
    totalArea: "Total Area",
    downloadPDF: "Download PDF",
    threeDRender: "3D Render",
    twoDPlan: "2D Plan",
    view360: "360°",
  },
  ka: {
    features: "მახასიათებლები:",
    hall: "ჰოლი",
    block: "ბლოკი",
    livingRoom: "მისაღები ოთახი",
    bedroom: "საძინებელი",
    wc: "სველი წერტილი",
    terrace: "აივანი",
    apartment: "ბინა",
    floor: "სართული",
    totalArea: "საერთო ფართი",
    downloadPDF: "PDF-ის გადმოწერა",
    threeDRender: "3D რენდერი",
    twoDPlan: "2D გეგმა",
    view360: "360°",
  },
};

const ApartmentDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("3D");

  const params = useParams();
  const apartmentId = params.id.split("-")[0];
  const lang = pathname.includes("/ka") ? "ka" : "en";
  const t = translations[lang];

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
      <div className="container mx-auto px-4 relative mb-8">
        <div className="flex justify-center w-full my-8">
          <FloorFilters
            initialFilters={{
              projects: data.project_id ? [data.project_id.toString()] : [],
              blocks: [data.block_id],
            }}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-8">
          <div>
            <div className="relative bg-white rounded-lg overflow-hidden cursor-pointer">
              <CldImage
                src={activeView === "2D" ? data.home_2d : data.home_3d}
                width={800}
                height={800}
                className="object-contain w-full lg:h-[550px]"
                alt={`${activeView} visualization`}
                cloudName="formus"
                quality={80}
              />
            </div>
          </div>

          <div className="space-y-8 lg:space-y-12 mt-8 lg:mt-[6rem]">
            <h2 className="text-xl">
              <span className="font-bold">
                {activeView === "3D" ? t.threeDRender : t.twoDPlan}
              </span>
              <span className="text-gray-400 mx-2">|</span>
              <button
                onClick={() => setActiveView(activeView === "3D" ? "2D" : "3D")}
                className="text-gray-400 hover:text-[#91b48c] font-bold"
              >
                {activeView === "3D" ? t.twoDPlan : t.threeDRender}
              </button>
              <span className="text-gray-400 mx-2">|</span>
              <span className="text-gray-400">{t.view360}</span>
            </h2>
            <div className="mt-4">
              {data.status === "sold" ? (
                <span className="bg-[#f94011] text-white px-2 py-1 rounded">
                  გაყიდულია
                </span>
              ) : (
                <span className="bg-[#a2c080] text-white px-2 py-1 rounded">
                  თავისუფალი
                </span>
              )}
            </div>

            <div className="flex items-start border-b border-gray-200">
              <div>
                <h3 className="text-base font-light gap-2">
                  {t.apartment}
                  <span className="font-bold gap-2 mx-2 mt-1">
                    {data.apartment_number}
                  </span>
                </h3>
                <p className="font-normal mt-2">
                  {t.floor}{" "}
                  <span className="font-bold text-base">{data.floor}</span>
                </p>
              </div>
              <div className="h-12 w-px bg-black mx-6" />
              <div>
                <h3 className="text-lg font-normal mb-1">{t.totalArea}</h3>
                <p className="text-base">{data.total_area} m²</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">{t.features}</h3>
              <div className="space-y-4">
                {data.hall_area > 0 && (
                  <div className="flex gap-2">
                    <span className="text-base font-light">{t.hall} /</span>
                    <span className="text-base">{data.hall_area} m²</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-base font-light">{t.block} /</span>
                  <span className="text-base">{data.block_id}</span>
                </div>

                {data.living_room_area > 0 && (
                  <div className="flex gap-2">
                    <span className="text-base font-light">
                      {t.livingRoom} /
                    </span>
                    <span className="text-base">
                      {data.living_room_area} m²
                    </span>
                  </div>
                )}
                {data.bedroom_area > 0 && (
                  <div className="flex gap-2">
                    <span className="text-base font-light">{t.bedroom} /</span>
                    <span className="text-base">{data.bedroom_area} m²</span>
                  </div>
                )}
                {data.bathroom_area > 0 && (
                  <div className="flex gap-2">
                    <span className="text-base font-light">{t.wc} /</span>
                    <span className="text-base">{data.bathroom_area} m²</span>
                  </div>
                )}
                {data.balcony_area > 0 && (
                  <div className="flex gap-2">
                    <span className="text-base font-light">{t.terrace} /</span>
                    <span className="text-base">{data.balcony_area} m²</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={downloadPDF}
              className="px-6 py-2.5 bg-[#91B48C] text-black text-sm 
           hover:bg-[#91B48C]/90 transition-colors uppercase 
           rounded-lg font-medium"
            >
              {t.downloadPDF}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetails;
