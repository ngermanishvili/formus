import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ApartmentFilters = ({ onSearch, onFilter, isMobile }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({
    block: "",
    status: "",
    sort: "",
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilter = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    onFilter?.(type, value);
  };

  const FiltersContent = () => (
    <div className="space-y-4 w-full">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ძიება ნომრით..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={filters.block}
          onValueChange={(value) => handleFilter("block", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="ბლოკი" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A ბლოკი</SelectItem>
            <SelectItem value="B">B ბლოკი</SelectItem>
            <SelectItem value="D">D ბლოკი</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => handleFilter("status", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="სტატუსი" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">ხელმისაწვდომი</SelectItem>
            <SelectItem value="sold">გაყიდული</SelectItem>
            <SelectItem value="reserved">დაჯავშნული</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sort}
          onValueChange={(value) => handleFilter("sort", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="სორტირება" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">ფასი ↑</SelectItem>
            <SelectItem value="price_desc">ფასი ↓</SelectItem>
            <SelectItem value="area_asc">ფართი ↑</SelectItem>
            <SelectItem value="area_desc">ფართი ↓</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <div className="fixed bottom-24 right-4 z-40">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="rounded-full p-3 bg-purple-500 text-white shadow-lg 
                          hover:bg-purple-600 active:bg-purple-700 transition-colors"
              >
                <SlidersHorizontal className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh]">
              <SheetHeader>
                <SheetTitle>ფილტრები</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div
          className="w-full max-w-6xl mx-auto px-4 py-6 bg-black/80 backdrop-blur-sm 
                        rounded-lg border border-purple-500/20 shadow-lg"
        >
          <FiltersContent />
        </div>
      )}
    </>
  );
};

export default ApartmentFilters;
