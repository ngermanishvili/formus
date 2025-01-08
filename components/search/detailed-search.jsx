import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  SlidersHorizontal,
  Building2,
  BedDouble,
  Home,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";

export function DetailedSearchFilter() {
  const [areaRange, setAreaRange] = useState({ min: 40, max: 200 });
  const [floorRange, setFloorRange] = useState({ min: 1, max: 16 });
  const [priceRange, setPriceRange] = useState({ min: 50000, max: 300000 });
  const [selectedFeatures, setSelectedFeatures] = useState(new Set());

  const features = [
    { id: "lift", label: "ლიფტი", icon: Building2 },
    { id: "balcony", label: "აივანი", icon: Home },
    { id: "heating", label: "გათბობა", icon: Building2 },
    { id: "gas", label: "ბუნებრივი აირი", icon: Building2 },
    { id: "water", label: "ცხელი წყალი", icon: Building2 },
    { id: "parking", label: "პარკინგი", icon: Building2 },
  ];

  const toggleFeature = (featureId) => {
    setSelectedFeatures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-50 text-gray-700 rounded-xl h-12 hidden md:flex items-center gap-2 border-gray-200"
        >
          <SlidersHorizontal className="w-4 h-4" />
          დეტალური ძიება
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto bg-gray-50/80 backdrop-blur-xl p-6"
      >
        <SheetHeader className="mb-8 space-y-2">
          <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            დეტალური ძიება
          </SheetTitle>
          <p className="text-gray-500">
            მოძებნეთ თქვენთვის სასურველი უძრავი ქონება დეტალური პარამეტრებით
          </p>
        </SheetHeader>

        <div className="space-y-8">
          {/* ფასის დიაპაზონი */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">ფასის დიაპაზონი</Label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="მინ"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="მაქს"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ფართი */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">ფართი (მ²)</Label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="მინ"
                  value={areaRange.min}
                  onChange={(e) =>
                    setAreaRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="მაქს"
                  value={areaRange.max}
                  onChange={(e) =>
                    setAreaRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ოთახების რაოდენობა */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">ოთახების რაოდენობა</Label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, "5+"].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-12 bg-white hover:bg-blue-50 hover:border-blue-200 data-[state=selected]:bg-blue-50 data-[state=selected]:border-blue-200"
                >
                  <BedDouble className="w-4 h-4 mr-2" />
                  {num}
                </Button>
              ))}
            </div>
          </div>

          {/* სართული */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">სართული</Label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="მინ"
                  value={floorRange.min}
                  onChange={(e) =>
                    setFloorRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="მაქს"
                  value={floorRange.max}
                  onChange={(e) =>
                    setFloorRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="h-12 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* მდგომარეობა */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">მდგომარეობა</Label>
            <RadioGroup defaultValue="any" className="grid gap-3">
              {[
                { value: "new", label: "ახალი გარემონტებული" },
                { value: "good", label: "კარგი რემონტი" },
                { value: "white", label: "თეთრი კარკასი" },
                { value: "black", label: "შავი კარკასი" },
              ].map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* დამატებითი ოფციები */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">დამატებითი ოფციები</Label>
            <div className="grid grid-cols-2 gap-3">
              {features.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant="outline"
                  className={`h-12 justify-start gap-3 bg-white hover:bg-blue-50 ${
                    selectedFeatures.has(id)
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-gray-200"
                  }`}
                  onClick={() => toggleFeature(id)}
                >
                  {selectedFeatures.has(id) ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  ) : (
                    <CircleDashed className="w-5 h-5" />
                  )}
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/20 transition-all duration-200"
            onClick={() => {
              document.querySelector('button[type="button"]').click();
            }}
          >
            ფილტრების გამოყენება
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
