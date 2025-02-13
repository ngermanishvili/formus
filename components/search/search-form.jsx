import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

const translations = {
  ka: {
    project: "პროექტი",
    location: "მდებარეობა",
    area: "ფართი",
    search: "ძებნა",
    ortachalaHills: "ორთაჭალა ჰილს",
    tbilisi: "თბილისი",
    foundApartments: "ნაპოვნია",
    units: "ბინა",
    areaLabel: "ფართი",
    loadMore: "მეტის ნახვა",
    choose: "არჩევა",
  },
  en: {
    project: "Project",
    location: "Location",
    area: "Area",
    search: "Search",
    ortachalaHills: "Ortachala Hills",
    tbilisi: "Tbilisi",
    foundApartments: "Found",
    units: "Apartments",
    areaLabel: "Area",
    loadMore: "Load More",
    choose: "Choose",
  },
};

export default function SearchForm() {
  const { locale = "ka" } = useParams() || {};
  const t = translations[locale] || translations.ka;

  const [showResults, setShowResults] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  const areaRanges = [
    { value: "20-40", label: "20-40 მ²" },
    { value: "40-60", label: "40-60 მ²" },
    { value: "60-80", label: "60-80 მ²" },
    { value: "80-100", label: "80-100 მ²" },
    { value: "100-120", label: "100-120 მ²" },
    { value: "120-150", label: "120-150 მ²" },
  ];

  const [searchParams, setSearchParams] = useState({
    project: "ortachala_hills",
    location: "tbilisi",
    areaRange: "",
  });

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
    let filtered = apartments.filter(
      (apt) => apt.block_id !== "D" && apt.status === "available"
    );

    if (searchParams.areaRange) {
      const [minArea, maxArea] = searchParams.areaRange.split("-").map(Number);
      filtered = filtered.filter(
        (apt) => apt.total_area >= minArea && apt.total_area <= maxArea
      );
    }

    setFilteredApartments(filtered);
    setVisibleCount(5);
    setShowResults(true);
    document.body.style.overflow = "hidden";
  };

  const handleSelect = (value, type) => {
    setSearchParams((prev) => ({ ...prev, [type]: value }));
  };

  const handleCloseResults = () => {
    setShowResults(false);
    document.body.style.overflow = "unset";
    setVisibleCount(5);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
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
    <div className="flex flex-col gap-4 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row w-full">
        <div
          className="w-full backdrop-blur-md bg-white/90 shadow-xl p-4 md:p-6 
                      flex flex-col md:flex-row items-stretch gap-4 md:gap-2 
                      max-w-6xl rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
        >
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-sm mb-1 text-left">{t.project}</p>
            <Select
              value="ortachala_hills"
              disabled
              onValueChange={(value) => handleSelect(value, "project")}
            >
              <SelectTrigger
                className="h-12 bg-gray-50 border-none rounded-xl 
                                     focus:ring-2 focus:ring-green-400 transition-all text-left"
              >
                <SelectValue placeholder={t.ortachalaHills} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ortachala_hills">
                  {t.ortachalaHills}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-sm mb-1 text-left">{t.location}</p>
            <Select
              value="tbilisi"
              disabled
              onValueChange={(value) => handleSelect(value, "location")}
            >
              <SelectTrigger
                className="h-12 bg-gray-50 border-none rounded-xl 
                                     focus:ring-2 focus:ring-green-400 transition-all text-left"
              >
                <SelectValue placeholder={t.tbilisi} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tbilisi">{t.tbilisi}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-sm mb-1 text-left">{t.area}</p>
            <Select onValueChange={(value) => handleSelect(value, "areaRange")}>
              <SelectTrigger
                className="h-12 bg-gray-50 border-none rounded-xl 
                                     focus:ring-2 focus:ring-green-400 transition-all text-left"
              >
                <SelectValue placeholder={t.choose} className="text-left" />
              </SelectTrigger>
              <SelectContent align="start">
                {areaRanges.map((range) => (
                  <SelectItem
                    key={range.value}
                    value={range.value}
                    className="text-left"
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="w-full md:w-[200px] bg-[#FBB200] p-4 md:p-6 
                   flex items-center justify-center gap-2
                   text-center transition-all cursor-pointer
                   hover:bg-[#e6a300] rounded-b-xl md:rounded-r-xl md:rounded-bl-none"
        >
          <Search className="w-5 h-5" />
          <span>{t.search}</span>
        </button>
      </div>

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
                  <div className="flex items-center">
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold">
                        {t.foundApartments} {filteredApartments.length}{" "}
                        {t.units}
                      </h2>
                      {searchParams.areaRange && (
                        <p className="text-gray-500">
                          {t.areaLabel}: {searchParams.areaRange} მ²
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
                        {t.loadMore}
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
