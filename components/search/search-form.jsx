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
    <div className="w-full bg-white rounded px-4 py-2 flex items-center gap-2 max-w-6xl mx-auto">
      <div className="flex-1 min-w-[200px]">
        <Input
          type="text"
          placeholder="საძიებო სიტყვა"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
        />
      </div>

      <div className="w-px h-6 bg-gray-200" />

      <div className="flex-1 min-w-[200px]">
        <Select>
          <SelectTrigger className="border-0 focus:ring-0 shadow-none h-10 px-0">
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

      <div className="w-px h-6 bg-gray-200" />

      <div className="flex-1 min-w-[200px]">
        <Select>
          <SelectTrigger className="border-0 focus:ring-0 shadow-none h-10 px-0">
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

      <div className="w-px h-6 bg-gray-200" />

      <Button
        variant="ghost"
        className="text-gray-600 hover:text-gray-800 px-2"
      >
        დეტალური
      </Button>

      <Button className="bg-black text-white hover:bg-gray-800 px-6">
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
}
