import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchForm() {
  const locations = ["თბილისი", "ბათუმი", "ქუთაისი", "რუსთავი", "გორი"];
  const propertyTypes = ["ბინა", "სახლი", "კომერციული ფართი", "მიწის ნაკვეთი"];

  return (
    <div className="w-full bg-white rounded-lg shadow-md px-4 py-2 flex flex-col md:flex-row items-center gap-2 max-w-6xl mx-auto">
      <div className="flex-1 w-full md:w-auto min-w-[200px]">
        <Input
          type="text"
          placeholder="საძიებო სიტყვა"
          className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-10 px-3 w-full"
        />
      </div>
      <div className="w-px h-6 bg-gray-200 md:hidden" />{" "}
      {/* Hide vertical line on mobile */}
      <div className="flex-1 w-full md:w-auto min-w-[200px]">
        <Select>
          <SelectTrigger className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-10 px-3 w-full">
            <SelectValue placeholder="მდებარეობა" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location.toLowerCase()}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-px h-6 bg-gray-200 md:hidden" />{" "}
      {/* Hide vertical line on mobile */}
      <div className="flex-1 w-full md:w-auto min-w-[200px]">
        <Select>
          <SelectTrigger className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-10 px-3 w-full">
            <SelectValue placeholder="ტიპი" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-px h-6 bg-gray-200 md:hidden" />{" "}
      {/* Hide vertical line on mobile */}
      <Button
        variant="ghost"
        className="text-gray-600 hover:text-gray-800 px-2 rounded-lg hidden md:block"
      >
        დეტალური
      </Button>
      <Button className="bg-black text-white hover:bg-gray-800 px-6 rounded-lg flex items-center">
        <Search className="w-4 h-4 mr-1" />
        ძიება
      </Button>
    </div>
  );
}
