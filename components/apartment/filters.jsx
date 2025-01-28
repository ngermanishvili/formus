import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Search, SlidersHorizontal, Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ApartmentFilters = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    floors: [],
    statuses: [],
    blocks: [],
  });

  // Effect for body scroll lock
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

  // Handler for toggling multiple selections
  const handleFilterToggle = useCallback((type, value) => {
    setFilters((prev) => {
      const currentValues = prev[type];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [type]: newValues };
    });
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      floors: [],
      statuses: [],
      blocks: [],
    });
  }, []);

  // Apply filters and search
  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (filters.floors.length) {
      queryParams.set("floors", filters.floors.join(","));
    }
    if (filters.statuses.length) {
      queryParams.set("statuses", filters.statuses.join(","));
    }
    if (filters.blocks.length) {
      queryParams.set("blocks", filters.blocks.join(","));
    }

    router.push(`/homes-list?${queryParams.toString()}`);
    setIsOpen(false);
  };

  // Calculate active filters count
  const activeFiltersCount = Object.values(filters).reduce(
    (count, arr) => count + arr.length,
    0
  );

  return (
    <>
      {/* Filter Button - Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-purple-600 hover:bg-purple-700
                  text-white shadow-xl shadow-purple-500/30 
                  transition-all duration-200 z-50 flex items-center gap-2
                  md:hidden"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={20} />
        <span className="font-medium">ფილტრი</span>
        {activeFiltersCount > 0 && (
          <span
            className="flex items-center justify-center w-5 h-5 text-xs 
                         bg-white text-purple-600 rounded-full"
          >
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Button - Desktop */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-6 p-4 rounded-full bg-purple-600 hover:bg-purple-700
                  text-white shadow-lg shadow-purple-500/20
                  transition-all duration-200 z-50 hidden md:flex items-center gap-2"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={20} />
        <span className="font-medium">ფილტრები</span>
        {activeFiltersCount > 0 && (
          <span
            className="flex items-center justify-center w-5 h-5 text-xs 
                         bg-white text-purple-600 rounded-full"
          >
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                     transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Filters Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 w-full max-w-md bg-gray-900 z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col pt-[40px] md:pt-[100px]
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <h2 id="filters-title" className="text-xl font-semibold text-white">
              ფილტრები
            </h2>
            {activeFiltersCount > 0 && (
              <span
                className="flex items-center justify-center w-6 h-6 text-sm
                             bg-purple-600 text-white rounded-full"
              >
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                className="relative group overflow-hidden px-4 py-2 rounded-xl
                          text-emerald-500 hover:text-white transition-colors duration-300"
                onClick={handleClearFilters}
              >
                <span
                  className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500 
                               transition-colors duration-300 -z-10"
                />
                <span className="absolute inset-0 border border-emerald-500/50 rounded-xl" />
                <span className="flex items-center gap-2">
                  <Trash2 size={18} className="relative z-10" />
                </span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white md:p-2
                         relative w-10 h-10 md:w-8 md:h-8
                         bg-gray-800 md:bg-transparent rounded-lg"
              aria-label="Close filters"
            >
              <X size={24} className="md:size-5" />
            </Button>
          </div>
        </div>

        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Blocks Filter */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">ბლოკი</h3>
            <div className="grid grid-cols-4 gap-2">
              {["A", "B", "D"].map((block) => (
                <button
                  key={block}
                  onClick={() => handleFilterToggle("blocks", block)}
                  className={`
                    relative p-3 rounded-xl text-center font-medium
                    transition-all duration-200
                    ${
                      filters.blocks.includes(block)
                        ? "bg-purple-600 text-white ring-2 ring-purple-400"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }
                  `}
                >
                  {block}
                  {filters.blocks.includes(block) && (
                    <Check size={14} className="absolute top-1 right-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Floors Filter */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">სართული</h3>
            <div className="grid grid-cols-3 gap-2">
              {["1-5", "6-10", "11-15"].map((range) => (
                <button
                  key={range}
                  onClick={() => handleFilterToggle("floors", range)}
                  className={`
                    relative p-3 rounded-xl text-center font-medium
                    transition-all duration-200
                    ${
                      filters.floors.includes(range)
                        ? "bg-purple-600 text-white ring-2 ring-purple-400"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }
                  `}
                >
                  {range}
                  {filters.floors.includes(range) && (
                    <Check size={14} className="absolute top-1 right-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">სტატუსი</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "available", label: "თავისუფალი" },
                { value: "reserved", label: "დაჯავშნული" },
                { value: "sold", label: "გაყიდული" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleFilterToggle("statuses", value)}
                  className={`
                    relative p-3 rounded-xl text-center font-medium
                    transition-all duration-200
                    ${
                      filters.statuses.includes(value)
                        ? "bg-purple-600 text-white ring-2 ring-purple-400"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }
                  `}
                >
                  {label}
                  {filters.statuses.includes(value) && (
                    <Check size={14} className="absolute top-1 right-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-800">
          <Button
            className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 
                       text-white font-medium transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            onClick={handleSearch}
            disabled={activeFiltersCount === 0}
          >
            <Search size={20} />
            ძებნა
            {activeFiltersCount > 0 && (
              <span
                className="flex items-center justify-center w-6 h-6 text-sm
                             bg-white text-purple-600 rounded-full"
              >
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ApartmentFilters;
