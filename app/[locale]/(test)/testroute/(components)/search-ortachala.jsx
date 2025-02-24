import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchFilters = ({ apartments, onFilterChange }) => {
  const blockOptions = [
    ...new Set(apartments.map((apt) => apt.block_id)),
  ].sort();
  const floorOptions = [...new Set(apartments.map((apt) => apt.floor))].sort(
    (a, b) => a - b
  );
  const statusOptions = [...new Set(apartments.map((apt) => apt.status))];

  return (
    <div className="w-full bg-transparent backdrop-blur-md p-4 md:p-6 rounded-lg  border-blue-500/20 mt-4 mx-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select onValueChange={(value) => onFilterChange("block", value)}>
            <SelectTrigger className="w-full bg-black/50 border-blue-500/30 text-white">
              <SelectValue placeholder="ბლოკი" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-blue-500/30">
              <SelectItem value="all" className="text-white">
                ყველა ბლოკი
              </SelectItem>
              {blockOptions.map((block) => (
                <SelectItem key={block} value={block} className="text-white">
                  {block} ბლოკი
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => onFilterChange("floor", value)}>
            <SelectTrigger className="w-full bg-black/50 border-blue-500/30 text-white">
              <SelectValue placeholder="სართული" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-blue-500/30">
              <SelectItem value="all" className="text-white">
                ყველა სართული
              </SelectItem>
              {floorOptions.map((floor) => (
                <SelectItem
                  key={floor}
                  value={floor.toString()}
                  className="text-white"
                >
                  {floor} სართული
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => onFilterChange("status", value)}>
            <SelectTrigger className="w-full bg-black/50 border-blue-500/30 text-white">
              <SelectValue placeholder="სტატუსი" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-blue-500/30">
              <SelectItem value="all" className="text-white">
                ყველა სტატუსი
              </SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="text-white">
                  {status === "available"
                    ? "ხელმისაწვდომი"
                    : status === "sold"
                    ? "გაყიდული"
                    : status === "reserved"
                    ? "დაჯავშნილი"
                    : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => onFilterChange("sort", value)}>
            <SelectTrigger className="w-full bg-black/50 border-blue-500/30 text-white">
              <SelectValue placeholder="სორტირება" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-blue-500/30">
              <SelectItem value="area_asc" className="text-white">
                ფართი (ზრდადობით)
              </SelectItem>
              <SelectItem value="area_desc" className="text-white">
                ფართი (კლებადობით)
              </SelectItem>
              <SelectItem value="floor_asc" className="text-white">
                სართული (ზრდადობით)
              </SelectItem>
              <SelectItem value="floor_desc" className="text-white">
                სართული (კლებადობით)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
