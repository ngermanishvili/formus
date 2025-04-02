import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, BedDouble, Sofa, DoorOpen, MapPin, Heart } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useLocale } from "next-intl";
import { getStatusText, getStatusStyle } from "@/lib/utils";

const translations = {
  en: {
    viewDetails: "View Details",
    floor: "Floor",
    block: "Block",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    totalArea: "Total Area",
    squareMeters: "m²",
    noApartments: "No apartments found",
  },
  ka: {
    viewDetails: "დეტალებზე გადასვლა",
    floor: "სართული",
    block: "ბლოკი",
    available: "ხელმისაწვდომი",
    reserved: "დაჯავშნილი",
    sold: "გაყიდული",
    totalArea: "საერთო ფართი",
    squareMeters: "კვ.მ",
    noApartments: "აპარტამენტი არ მოიძებნა",
  },
};

export default function PropertyResults({ apartments = [] }) {
  const [favorites, setFavorites] = useState(new Set());
  const locale = useLocale();
  const t = translations[locale];

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const navigateToDetails = (id) => {
    window.location.href = `/apartment/${id}`;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-500";
      case "reserved":
        return "bg-orange-500";
      case "sold":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const sortedApartments = [...apartments].sort(
    (a, b) => a.total_area - b.total_area
  );

  if (apartments.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-xl text-zinc-500">{t.noApartments}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {sortedApartments.map((property) => (
            <Card
              key={property.apartment_id}
              className="group overflow-hidden bg-white border-zinc-800 hover:border-[#FCB203]/50 hover:shadow-xl hover:shadow-[#FCB203]/10 transition-all duration-300"
            >
              <div className="grid md:grid-cols-[400px,1fr]">
                <div className="relative h-64 md:h-full overflow-hidden">
                  <CldImage
                    width={400}
                    height={300}
                    quality={80}
                    src={property.home_3d || "/api/placeholder/400/300"}
                    alt={`Apartment ${property.apartment_id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-4 right-4 bg-black/70 hover:bg-black rounded-full ${
                      favorites.has(property.apartment_id)
                        ? "text-[#FCB203] hover:text-[#FCB203]"
                        : "text-white hover:text-[#FCB203]"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property.apartment_id);
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        favorites.has(property.apartment_id)
                          ? "fill-[#FCB203]"
                          : ""
                      }`}
                    />
                  </Button>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-black group-hover:text-[#FCB203] transition-colors">
                        {t.block} {property.block_id}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-zinc-400">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {t.floor} {property.floor}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                          property.status
                        )}`}
                      >
                        {getStatusText(property.status, locale)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <Home className="w-5 h-5 text-[#FCB203]" />
                      <span>
                        {property.total_area} {t.squareMeters}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500">
                      <BedDouble className="w-5 h-5 text-[#FCB203]" />
                      <span>
                        {t.floor} {property.floor}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500">
                      <Sofa className="w-5 h-5 text-[#FCB203]" />
                      <span>
                        {t.block} {property.block_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500">
                      <DoorOpen className="w-5 h-5 text-[#FCB203]" />
                      <span>{getStatusText(property.status, locale)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#FCB203] hover:bg-[#e6a003] text-black font-medium transition-colors mt-[50px]"
                    onClick={() => navigateToDetails(property.apartment_id)}
                  >
                    {t.viewDetails}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
