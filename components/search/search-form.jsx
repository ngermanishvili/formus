import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const translations = {
  ka: {
    project: "პროექტი",
    location: "მდებარეობა",
    area: "ფართი",
    search: "ძებნა",
    ortachalaHills: "ორთაჭალა ჰილს",
    tbilisi: "თბილისი",
    choose: "არჩევა",
  },
  en: {
    project: "Project",
    location: "Location",
    area: "Area",
    search: "Search",
    ortachalaHills: "Ortachala Hills",
    tbilisi: "Tbilisi",
    choose: "Choose",
  },
};

export default function SearchForm() {
  const { locale = "ka" } = useParams() || {};
  const router = useRouter();
  const t = translations[locale] || translations.ka;

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

  const handleSelect = (value, type) => {
    setSearchParams((prev) => ({ ...prev, [type]: value }));
  };

  const handleSearch = () => {
    // Only proceed with search if area range is selected
    if (searchParams.areaRange) {
      const [minArea, maxArea] = searchParams.areaRange.split("-");

      // Create query parameters
      const params = new URLSearchParams();
      params.set("totalAreaMin", minArea);
      params.set("totalAreaMax", maxArea);

      // Create the URL
      const url = `/${locale}/homes-list?${params.toString()}`;
      // Redirect to the filtered results page
      window.location.href = url;
    }
  };

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
    </div>
  );
}
