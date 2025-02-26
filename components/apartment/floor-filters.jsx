import React, { useState, useCallback, useEffect } from "react";
import { ChevronDown, X, Search, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/routing";

const translations = {
  en: {
    back: "Back",
    block: "Block",
    blocks: "Blocks",
    floor: "Floor",
    floors: "Floors",
    status: "Status",
    search: "Search",
    filter: "Filter",
    filters: "Filters",
    clear: "Clear",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    area: "Area",
    areas: "Areas",
  },
  ka: {
    back: "← უკან",
    block: "ბლოკი",
    blocks: "ბლოკები",
    floor: "სართული",
    floors: "სართული",
    status: "სტატუსი",
    search: "ძებნა",
    filter: "ფილტრი",
    filters: "ფილტრები",
    clear: "გასუფთავება",
    available: "თავისუფალი",
    reserved: "დაჯავშნილი",
    sold: "გაყიდული",
    area: "ფართი",
    areas: "ფართი",
  },
};
const areaRanges = [
  { value: "20-40", label: "20-40 მ²" },
  { value: "40-60", label: "40-60 მ²" },
  { value: "60-80", label: "60-80 მ²" },
  { value: "80-100", label: "80-100 მ²" },
  { value: "100-120", label: "100-120 მ²" },
  { value: "120-150", label: "120-150 მ²" },
];

const FilterButton = ({ label, children, isActive, isOpen, onToggle }) => {
  return (
    <div className="relative">
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                     border transition-all duration-200
                     ${
                       isActive
                         ? "bg-[#FBB200] border-[#FBB200] text-black"
                         : "bg-transparent border-black/30 text-black hover:border-black"
                     }`}
        onClick={onToggle}
      >
        {label}
        <ChevronDown
          size={16}
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-white rounded-lg border border-black/30 shadow-xl z-50">
          {children}
        </div>
      )}
    </div>
  );
};

const FloorFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = translations[locale];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({
    floors: [],
    statuses: [],
    blocks: [],
    areas: [], // Add areas to filters state
  });

  const blockFloors = {
    A: Array.from({ length: 8 }, (_, i) => i + 1),
    B: Array.from({ length: 8 }, (_, i) => i + 1),
    D: Array.from({ length: 15 }, (_, i) => i + 1),
  };

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  const handleFilterToggle = useCallback((type, value, entireRow = false) => {
    if (type === "areas") {
      setFilters((prev) => {
        const currentValues = prev[type];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return { ...prev, [type]: newValues };
      });
    } else if (type === "blocks") {
      setFilters((prev) => {
        let newValues = [...prev.blocks];

        if (entireRow) {
          if (prev.blocks.includes(value)) {
            newValues = newValues.filter((v) => v !== value);
          } else {
            if (value === "D") {
              if (newValues.some((v) => v === "A" || v === "B")) {
                return prev;
              }
              newValues = ["D"];
            } else {
              if (newValues.includes("D")) {
                newValues = [value];
              } else {
                newValues.push(value);
              }
            }
          }
        } else {
          if (prev.blocks.includes(value)) {
            newValues = newValues.filter((v) => v !== value);
          } else {
            if (value === "D") {
              if (newValues.some((v) => v === "A" || v === "B")) {
                return prev;
              }
              newValues = ["D"];
            } else {
              if (newValues.includes("D")) {
                return prev;
              }
              newValues.push(value);
            }
          }
        }

        return { ...prev, blocks: newValues, floors: [] };
      });
    } else {
      setFilters((prev) => {
        const currentValues = prev[type];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return { ...prev, [type]: newValues };
      });
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      floors: [],
      statuses: [],
      blocks: [],
      areas: [], // დავამატოთ areas მასივ
    });
  }, []);

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
    if (filters.areas.length) {
      const [minArea, maxArea] = filters.areas[0].split("-");
      queryParams.set("totalAreaMin", minArea);
      queryParams.set("totalAreaMax", maxArea);
    }

    router.push(`/${locale}/homes-list?${queryParams.toString()}`);
    setIsDrawerOpen(false);
  };

  const getAvailableFloors = () => {
    if (filters.blocks.length === 0) return [];
    const maxFloor = Math.max(
      ...filters.blocks.map((block) => blockFloors[block].length)
    );
    return Array.from({ length: maxFloor }, (_, i) => i + 1);
  };

  const activeFiltersCount = Object.values(filters).reduce(
    (count, arr) => count + arr.length,
    0
  );

  const getStatusLabel = (status) => {
    return t[status] || status;
  };

  return (
    <>
      <div className="relative bg-white border-b border-black/30">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={pathname.includes("/floor") ? "/choose-apartment" : "/"}
              className=" items-center gap-2 px-4 py-2 rounded-lg
             bg-[#FBB200] font-medium
             transition-colors duration-200
             border border-[#FBB200] text-black hidden sm:block md:hidden lg:block "
            >
              <span className="text-black hover:text-black min-w-[100px]">
                {t.back}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <FilterButton
                label={
                  filters.blocks.length > 0
                    ? filters.blocks.length === 1
                      ? `${filters.blocks[0]} ${t.block}`
                      : `${filters.blocks.join(" & ")} ${t.block}`
                    : t.block
                }
                isActive={filters.blocks.length > 0}
                isOpen={openFilter === "block"}
                onToggle={() =>
                  setOpenFilter(openFilter === "block" ? null : "block")
                }
              >
                <div className="space-y-1">
                  {["A", "B", "D"].map((block) => (
                    <label
                      key={block}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-black/5 rounded cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilterToggle("blocks", block, true);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={filters.blocks.includes(block)}
                        className="text-[#FBB200]"
                        onChange={(e) => {
                          e.stopPropagation();
                          handleFilterToggle("blocks", block, false);
                        }}
                        disabled={
                          (block === "D" &&
                            filters.blocks.some(
                              (b) => b === "A" || b === "B"
                            )) ||
                          ((block === "A" || block === "B") &&
                            filters.blocks.includes("D"))
                        }
                      />
                      <span className="text-black">
                        {t.block} {block}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterButton>
              <FilterButton
                label={
                  filters.areas.length > 0 ? `${filters.areas[0]} მ²` : t.area
                }
                isActive={filters.areas.length > 0}
                isOpen={openFilter === "area"}
                onToggle={() =>
                  setOpenFilter(openFilter === "area" ? null : "area")
                }
              >
                <div className="space-y-1">
                  {areaRanges.map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center gap-2 px-2 py-1.5 
                                hover:bg-black/5 rounded cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilterToggle("areas", range.value, true);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={filters.areas.includes(range.value)}
                        className="text-[#FBB200]"
                        onChange={(e) => {
                          e.stopPropagation();
                          handleFilterToggle("areas", range.value, false);
                        }}
                      />
                      <span className="text-black">{range.label}</span>
                    </label>
                  ))}
                </div>
              </FilterButton>

              <FilterButton
                label={
                  filters.floors.length > 0
                    ? `${filters.floors.length} ${t.floors}`
                    : t.floor
                }
                isActive={filters.floors.length > 0}
                isOpen={openFilter === "floor"}
                onToggle={() =>
                  setOpenFilter(openFilter === "floor" ? null : "floor")
                }
              >
                <div className="space-y-1">
                  {getAvailableFloors().map((floor) => (
                    <label
                      key={floor}
                      className="flex items-center gap-2 px-2 py-1.5 
                                hover:bg-black/5 rounded cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilterToggle("floors", floor, true);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={filters.floors.includes(floor)}
                        className="text-[#FBB200]"
                        onChange={(e) => {
                          e.stopPropagation();
                          handleFilterToggle("floors", floor, false);
                        }}
                      />
                      <span className="text-black">
                        {floor} {t.floor}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterButton>

              <FilterButton
                label={
                  filters.statuses.length > 0
                    ? filters.statuses
                        .map((status) => getStatusLabel(status))
                        .join(" & ")
                    : t.status
                }
                isActive={filters.statuses.length > 0}
                isOpen={openFilter === "status"}
                onToggle={() =>
                  setOpenFilter(openFilter === "status" ? null : "status")
                }
              >
                <div className="space-y-1">
                  {[
                    { value: "available", label: t.available },
                    { value: "reserved", label: t.reserved },
                    { value: "sold", label: t.sold },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 px-2 py-1.5 
                                hover:bg-black/5 rounded cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilterToggle("statuses", value, true);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={filters.statuses.includes(value)}
                        className="text-[#FBB200]"
                        onChange={(e) => {
                          e.stopPropagation();
                          handleFilterToggle("statuses", value, false);
                        }}
                      />
                      <span className="text-black">{label}</span>
                    </label>
                  ))}
                </div>
              </FilterButton>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  className="relative group px-3 py-2 rounded-lg
                            text-red-500 hover:text-white transition-colors duration-300"
                  onClick={handleClearFilters}
                >
                  <span
                    className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500 
                              transition-colors duration-300 -z-10 rounded-lg"
                  />
                  <Trash2 size={18} />
                </Button>
              )}

              <Button
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-[#FBB200] hover:bg-[#FBB200]/90 text-black
                         transition-colors duration-200"
                onClick={handleSearch}
                disabled={activeFiltersCount === 0}
              >
                <Search size={18} />
                {t.search}
                {activeFiltersCount > 0 && (
                  <span
                    className="flex items-center justify-center w-5 h-5 text-xs 
                              bg-black text-[#FBB200] rounded-full ml-1"
                  >
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className={`absolute ${
          pathname === "/ka/homes-list" ? "max-md:top-20" : "top-0"
        } 
                  w-[90%] flex justify-center items-center h-[50px] bottom-6 right-6 p-4 
                  rounded-md bg-[#FBB200] hover:bg-[#FBB200]/90 text-black shadow-xl 
                  transition-all duration-200 md:hidden text-center gap-2`}
      >
        <Search size={20} />
        <span className="font-medium">{t.filter}</span>
        {activeFiltersCount > 0 && (
          <span
            className="flex items-center justify-center w-5 h-5 text-xs 
                        bg-black text-[#FBB200] rounded-full"
          >
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div
            className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-900 
                        z-50 transform transition-all duration-300 ease-out p-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">{t.filters}</h2>
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X size={24} />
              </Button>
            </div>

            {/* Mobile Filters Content */}
            <div className="space-y-6">
              {/* Blocks */}
              <div>
                <h3 className="text-white/90 mb-3">{t.block}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["A", "B", "D"].map((block) => (
                    <button
                      key={block}
                      onClick={() => handleFilterToggle("blocks", block)}
                      className={`p-3 rounded-lg text-center font-medium
                                ${
                                  filters.blocks.includes(block)
                                    ? "bg-[#FBB200] text-black"
                                    : "bg-white/10 text-white/90"
                                }`}
                    >
                      {t.block} {block}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floors */}
              <div>
                <h3 className="text-white/90 mb-3">{t.floor}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {getAvailableFloors().map((floor) => (
                    <button
                      key={floor}
                      onClick={() => handleFilterToggle("floors", floor)}
                      className={`p-3 rounded-lg text-center font-medium
                                ${
                                  filters.floors.includes(floor)
                                    ? "bg-[#FBB200] text-black"
                                    : "bg-black/20 text-white/90"
                                }`}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statuses */}
              <div>
                <h3 className="text-white/90 mb-3">{t.status}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "available", label: t.available },
                    { value: "reserved", label: t.reserved },
                    { value: "sold", label: t.sold },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleFilterToggle("statuses", value)}
                      className={`p-3 rounded-lg text-center font-medium
                                ${
                                  filters.statuses.includes(value)
                                    ? "bg-[#FBB200] text-black"
                                    : "bg-white/10 text-white/90"
                                }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Area filter section for mobile */}
            <div>
              <h3 className="text-white/90 mb-3">{t.area}</h3>
              <div className="grid grid-cols-2 gap-2">
                {areaRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleFilterToggle("areas", range.value)}
                    className={`p-3 rounded-lg text-center font-medium
                                ${
                                  filters.areas.includes(range.value)
                                    ? "bg-[#FBB200] text-black"
                                    : "bg-white/10 text-white/90"
                                }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Mobile Action Buttons */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4 
                          border-t border-white/10 bg-gray-900"
            >
              <div className="flex gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={handleClearFilters}
                  >
                    {t.clear}
                  </Button>
                )}
                <Button
                  className="flex-1 bg-[#FBB200] hover:bg-[#FBB200]/90 text-black"
                  onClick={handleSearch}
                  disabled={activeFiltersCount === 0}
                >
                  <Search size={18} className="mr-2" />
                  {t.search}
                  {activeFiltersCount > 0 && (
                    <span
                      className="ml-1 flex items-center justify-center w-5 h-5 
                                   bg-black text-[#FBB200] rounded-full"
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FloorFilters;
