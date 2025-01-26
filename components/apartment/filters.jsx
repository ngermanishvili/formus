import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const ApartmentFilters = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    floor: "all",
    floorMin: "",
    floorMax: "",
    status: "all",
    blockId: "all",
  });

  const handleFilterChange = useCallback((name, value) => {
    if (name === "floor" && value !== "all") {
      const [min, max] = value.split("-");
      setFilters((prev) => ({
        ...prev,
        floor: value,
        floorMin: min,
        floorMax: max,
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (filters.floorMin) {
      queryParams.set("floorMin", filters.floorMin);
      queryParams.set("floorMax", filters.floorMax);
    }
    if (filters.status !== "all") queryParams.set("status", filters.status);
    if (filters.blockId !== "all") queryParams.set("blockId", filters.blockId);

    router.push(`/homes-list?${queryParams.toString()}`);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="transparent bottom-[500px] right-4 p-4 rounded-full bg-purple-500 hover:bg-purple-600
                  text-white shadow-xl shadow-purple-500/30 backdrop-blur-sm
                  bg-opacity-95 transition-all duration-200 z-50
                  md:hidden" // Hide on desktop
        aria-label="Open filters"
      >
        <Search size={14} />
      </button>

      {/* Desktop Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 p-3 rounded-full bg-purple-500 hover:bg-purple-600
                  text-white shadow-lg shadow-purple-500/20 backdrop-blur-sm
                  bg-opacity-90 transition-all duration-200 z-50
                  hidden md:block" // Show only on desktop
        aria-label="Open filters"
      >
        <Search size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filters Panel */}
      <div
        className={`
          fixed inset-0 top-0 h-screen w-full bg-gray-900 z-50 
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:inset-auto md:top-[72px] md:right-0 md:h-[calc(100vh-72px)] md:w-96
        `}
      >
        <div className="h-full flex flex-col pb-safe">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">ფილტრები</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close filters"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Filters Content */}
          <div className="flex-1 p-4 md:p-6 space-y-8 overflow-y-auto">
            {/* Block Filter */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">ბლოკი</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["all", "A", "B", "D"].map((block) => (
                  <button
                    key={block}
                    onClick={() => handleFilterChange("blockId", block)}
                    className={`
                      p-3 rounded-lg text-center font-medium transition-all
                      ${
                        filters.blockId === block
                          ? "bg-purple-500 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }
                    `}
                  >
                    {block === "all" ? "ყველა" : block}
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Filter */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">სართული</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {["all", "1-5", "6-10", "11-15", "16-20"].map((range) => (
                  <button
                    key={range}
                    onClick={() => handleFilterChange("floor", range)}
                    className={`
                      p-3 rounded-lg text-center font-medium transition-all
                      ${
                        filters.floor === range
                          ? "bg-purple-500 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }
                    `}
                  >
                    {range === "all" ? "ყველა" : range}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">სტატუსი</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { value: "all", label: "ყველა" },
                  { value: "available", label: "თავისუფალი" },
                  { value: "reserved", label: "დაჯავშნული" },
                  { value: "sold", label: "გაყიდული" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleFilterChange("status", value)}
                    className={`
                      p-3 rounded-lg text-center font-medium transition-all
                      ${
                        filters.status === value
                          ? "bg-purple-500 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="p-4 md:p-6 border-t border-gray-800">
            <Button
              className="w-full h-12 text-lg bg-purple-500 hover:bg-purple-600 text-white"
              onClick={handleSearch}
            >
              ძებნა
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApartmentFilters;
