import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import PropertyResults from "./search-table";

export default function SearchForm() {
  const router = useRouter();
  const t = useTranslations("SearchForm");
  const [showResults, setShowResults] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  const [searchParams, setSearchParams] = useState({
    project: "ortachala_hills",
    location: "tbilisi",
    areaRange: "",
  });

  const areaRanges = [
    { value: "20-40", label: "20-40 მ²" },
    { value: "40-60", label: "40-60 მ²" },
    { value: "60-80", label: "60-80 მ²" },
    { value: "80-100", label: "80-100 მ²" },
    { value: "100-120", label: "100-120 მ²" },
    { value: "120-150", label: "120-150 მ²" },
  ];

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch("/api/apartments");
        const data = await response.json();
        setApartments(data.data || []);
      } catch (error) {
        console.error("Error fetching apartments:", error);
      }
    };
    fetchApartments();
  }, []);

  const handleSearch = () => {
    let filtered;
    if (!searchParams.areaRange) {
      filtered = apartments.filter(
        (apt) => apt.block_id !== "D" && apt.status === "available"
      );
    } else {
      const [minArea, maxArea] = searchParams.areaRange.split("-").map(Number);
      filtered = apartments.filter(
        (apt) =>
          apt.block_id !== "D" &&
          apt.status === "available" &&
          apt.total_area >= minArea &&
          apt.total_area <= maxArea
      );
    }
    setFilteredApartments(filtered);
    setVisibleCount(5);
    setShowResults(true);
    document.body.style.overflow = "hidden";
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    document.body.style.overflow = "unset";
    setVisibleCount(5);
  };

  const handleSelect = (value, type) => {
    setSearchParams((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showResults && !event.target.closest(".results-container")) {
        handleCloseResults();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showResults]);

  const visibleApartments = filteredApartments.slice(0, visibleCount);
  const hasMore = visibleCount < filteredApartments.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full backdrop-blur-md bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 max-w-6xl mx-auto transition-all">
        {/* Project Select */}
        <div className="flex-1 w-full">
          <p className="text-gray-500 text-sm mb-1">{t("project")}</p>
          <Select
            value="ortachala_hills"
            disabled
            onValueChange={(value) => handleSelect(value, "project")}
          >
            <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-400 transition-all">
              <SelectValue placeholder={t("ortachalaHills")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ortachala_hills">
                {t("ortachalaHills")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Select */}
        <div className="flex-1 w-full">
          <p className="text-gray-500 text-sm mb-1">{t("location")}</p>
          <Select
            value="tbilisi"
            disabled
            onValueChange={(value) => handleSelect(value, "location")}
          >
            <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-400 transition-all">
              <SelectValue placeholder={t("tbilisi")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tbilisi">{t("tbilisi")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Area Select */}
        <div className="flex-1 w-full">
          <p className="text-gray-500 text-sm mb-1">{t("area")}</p>
          <Select onValueChange={(value) => handleSelect(value, "areaRange")}>
            <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-400 transition-all">
              <SelectValue placeholder={t("chooseArea")} />
            </SelectTrigger>
            <SelectContent>
              {areaRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            className="bg-black hover:bg-gray-800 text-white rounded-xl h-12 px-8 w-full md:w-auto flex items-center gap-2 transition-all"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5" />
            {t("search")}
          </Button>
        </div>
      </div>

      {/* Results Overlay */}
      {showResults && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={handleCloseResults}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 py-8 md:py-20">
              <div className="results-container bg-white rounded-2xl w-full max-w-6xl mx-auto p-4 md:p-6 relative">
                <button
                  onClick={handleCloseResults}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2"
                >
                  <X size={24} />
                </button>
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        ნაპოვნია {filteredApartments.length} ბინა
                      </h2>
                      {searchParams.areaRange && (
                        <p className="text-gray-500">
                          ფართი: {searchParams.areaRange} მ²
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="animate-in slide-in-from-top duration-500 max-h-[70vh] overflow-y-auto">
                  <PropertyResults apartments={visibleApartments} />

                  {hasMore && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={handleLoadMore}
                        className="bg-black hover:bg-gray-800 text-white rounded-xl px-8 py-2"
                      >
                        მეტის ნახვა
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
