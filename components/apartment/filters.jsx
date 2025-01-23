import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FiltersPanel = ({
  selectedBlock,
  setSelectedBlock,
  selectedFloor,
  setSelectedFloor,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  areaRange,
  setAreaRange,
  resetFilters,
  applyFilters,
  uniqueBlocks,
  uniqueFloors,
}) => {
  const [isOpen, setIsOpen] = useState("filters");

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
      <Accordion
        type="single"
        collapsible
        value={isOpen}
        onValueChange={setIsOpen}
      >
        <AccordionItem value="filters" className="border-none">
          <div className="flex justify-between items-center mb-6">
            <AccordionTrigger className="hover:no-underline">
              <h3 className="text-lg font-semibold">ფილტრები</h3>
            </AccordionTrigger>
            <Button variant="ghost" onClick={resetFilters} className="text-sm">
              გასუფთავება
            </Button>
          </div>

          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ბლოკი</label>
                <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ ბლოკი" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ყველა ბლოკი</SelectItem>
                    {uniqueBlocks.map((block) => (
                      <SelectItem key={block} value={block}>
                        ბლოკი {block}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">სართული</label>
                <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ სართული" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ყველა სართული</SelectItem>
                    {uniqueFloors.map((floor) => (
                      <SelectItem key={floor} value={floor.toString()}>
                        სართული {floor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">სტატუსი</label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ სტატუსი" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ყველა სტატუსი</SelectItem>
                    <SelectItem value="available">ხელმისაწვდომი</SelectItem>
                    <SelectItem value="reserved">დაჯავშნული</SelectItem>
                    <SelectItem value="sold">გაყიდული</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">სორტირება</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ სორტირება" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area-asc">ფართი (ზრდადობით)</SelectItem>
                    <SelectItem value="area-desc">
                      ფართი (კლებადობით)
                    </SelectItem>
                    <SelectItem value="floor-asc">
                      სართული (ზრდადობით)
                    </SelectItem>
                    <SelectItem value="floor-desc">
                      სართული (კლებადობით)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-full md:col-span-2">
                <label className="text-sm font-medium">
                  ფართის დიაპაზონი (მ²)
                </label>
                <div className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="მინ. ფართი"
                    value={areaRange.min}
                    onChange={(e) =>
                      setAreaRange((prev) => ({ ...prev, min: e.target.value }))
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="მაქს. ფართი"
                    value={areaRange.max}
                    onChange={(e) =>
                      setAreaRange((prev) => ({ ...prev, max: e.target.value }))
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={applyFilters} className="w-full md:w-auto">
                ძებნა
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FiltersPanel;
