import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import PropertyResults from "./search-table";

export default function SearchForm() {
  const [showResults, setShowResults] = useState(false);
  const [searchParams, setSearchParams] = useState({
    project: "",
    location: "თბილისი",
    type: "",
  });

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
          <p className="text-gray-500 text-sm mb-1">პროექტი</p>
          <Select onValueChange={(value) => handleSelect(value, "project")}>
            <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-400 transition-all">
              <SelectValue placeholder="Ortachala Hills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ortachala_hills">Ortachala Hills</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 w-full">
          <p className="text-gray-500 text-sm mb-1">მდებარეობა</p>
          <Select
            onValueChange={(value) => handleSelect(value, "location")}
            defaultValue="თბილისი"
          >
            <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-400 transition-all">
              <SelectValue placeholder="თბილისი" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="თბილისი">თბილისი</SelectItem>
              <SelectItem value="ბათუმი" disabled className="text-green-500">
                ბათუმი <span className="ml-2">Soon</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 w-full">
          <p className="text-gray-500 text-sm mb-1">ტიპი</p>
          <Select onValueChange={(value) => handleSelect(value, "type")}>
            <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-400 transition-all">
              <SelectValue placeholder="აირჩიეთ ტიპი" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">ბინა</SelectItem>
              <SelectItem value="commercial">კომერციული ფართი</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl h-12 hidden md:flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            დეტალური
          </Button>
          <Button
            className="bg-black hover:bg-gray-800 text-white rounded-xl h-12 px-8 w-full md:w-auto flex items-center gap-2 transition-all"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5" />
            ძიება
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
