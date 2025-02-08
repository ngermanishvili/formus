import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, BedDouble, Sofa, DoorOpen, MapPin, Heart } from "lucide-react";
import { CldImage } from "next-cloudinary";

export default function PropertyResults({ apartments = [] }) {
  const [favorites, setFavorites] = useState(new Set());

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

  // სორტირება total_area-ს მიხედვით
  const sortedApartments = [...apartments].sort(
    (a, b) => a.total_area - b.total_area
  );

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-6 bg-gradient-to-b from-white to-gray-50">
        <div className="grid gap-6">
          {sortedApartments.map((property) => (
            <div
              key={property.apartment_id}
              className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="grid md:grid-cols-[300px,1fr] gap-6">
                <div className="relative h-48 md:h-full overflow-hidden">
                  <CldImage
                    width={400}
                    height={300}
                    quality={70}
                    src={property.home_3d || "/api/placeholder/400/300"}
                    alt={`Apartment ${property.apartment_id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full ${
                      favorites.has(property.apartment_id)
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-500 hover:text-gray-600"
                    }`}
                    onClick={() => toggleFavorite(property.apartment_id)}
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </Button>
                </div>

                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        Block {property.block_id}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>Floor {property.floor}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {property.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Home className="w-4 h-4" />
                      <span>{property.total_area} მ²</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <BedDouble className="w-4 h-4" />
                      <span>Floor {property.floor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Sofa className="w-4 h-4" />
                      <span>Block {property.block_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DoorOpen className="w-4 h-4" />
                      <span>{property.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Button
                  variant="ghost"
                  onClick={() => navigateToDetails(property.apartment_id)}
                >
                  <span className="text-gray-500">დეტალებზე გადასვლა</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
