"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import PropertyResults from "./search-table";

export default function SearchForm() {
  const [showResults, setShowResults] = useState(false);
  const locations = ["თბილისი", "ბათუმი", "ქუთაისი", "რუსთავი", "გორი"];
  const propertyTypes = ["ბინა", "სახლი", "კომერციული ფართი", "მიწის ნაკვეთი"];

  const handleSearch = () => {
    setShowResults(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full backdrop-blur-md bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 max-w-6xl mx-auto transition-all">
        <div className="flex-1 w-full">
          <p className="text-gray-500 text-sm mb-1 text-left w-[250px]">
            საძიებო სიტყვა
          </p>
          <Input
            type="text"
            placeholder="Search keyword"
            className="h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-400 transition-all text-black"
          />
        </div>

        <div className="flex-1 w-full">
          <p className="text-gray-500 text-sm mb-1 text-left">მდებარეობა</p>
          <Select>
            <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-400 transition-all">
              <SelectValue
                placeholder={
                  <span className="font-bold text-black">
                    მდებარეობის არჩევა
                  </span>
                }
              />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem
                  key={location}
                  value={location.toLowerCase()}
                  className="hover:bg-green-50"
                >
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 w-full">
          <p className="text-gray-500 text-sm mb-1 text-left">ტიპი</p>
          <Select>
            <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-400 transition-all">
              <SelectValue
                placeholder={
                  <span className="font-bold text-black">ყველა</span>
                }
              />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type.toLowerCase()}
                  className="hover:bg-green-50"
                >
                  {type}
                </SelectItem>
              ))}
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

      {showResults && <PropertyResults />}
    </div>
  );
}
