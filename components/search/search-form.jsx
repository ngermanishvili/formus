import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import PropertyResults from "./search-table";

export default function SearchForm() {
  const t = useTranslations("SearchForm");

  const [showResults, setShowResults] = useState(false);
  const [searchParams, setSearchParams] = useState({
    project: "ortachala_hills",
    location: "tbilisi",
    areaRange: "",
  });

  const areaRanges = [
    { value: "20-60", label: "20-60 მ²" },
    { value: "60-100", label: "60-100 მ²" },
    { value: "100-150", label: "100-150 მ²" },
    { value: "150-200", label: "150-200 მ²" },
    { value: "200-250", label: "200-250 მ²" },
  ];

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleSelect = (value, type) => {
    setSearchParams((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full backdrop-blur-md bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 max-w-6xl mx-auto transition-all">
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

      {showResults && (
        <div className="animate-in slide-in-from-top duration-500">
          <PropertyResults searchParams={searchParams} />
        </div>
      )}
    </div>
  );
}
