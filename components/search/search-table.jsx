import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, BedDouble, Sofa, DoorOpen, MapPin, Heart } from "lucide-react";

const propertyData = [
  {
    id: 1,
    address: "ვაჟა-ფშაველას 76",
    area: 120,
    bedrooms: 3,
    livingRoom: "დიდი",
    hall: "კი",
    priceUSD: 150000,
    type: "ბინა",
    location: "თბილისი",
    isNew: true,
    floor: "7/12",
    renovation: "ახალი რემონტი",
    metro: "დელისი",
    image: "/api/placeholder/400/300",
    promoted: true,
  },
  {
    id: 2,
    address: "პეკინის 24",
    area: 85,
    bedrooms: 2,
    livingRoom: "საშუალო",
    hall: "კი",
    priceUSD: 98000,
    type: "ბინა",
    location: "თბილისი",
    isNew: false,
    floor: "4/9",
    renovation: "ევრო რემონტი",
    metro: "რუსთაველი",
    image: "/api/placeholder/400/300",
  },
  {
    id: 3,
    address: "ჭავჭავაძის 42",
    area: 160,
    bedrooms: 4,
    livingRoom: "დიდი",
    hall: "კი",
    priceUSD: 220000,
    type: "ბინა",
    location: "თბილისი",
    isNew: true,
    floor: "11/14",
    renovation: "ახალი რემონტი",
    metro: "მარჯანიშვილი",
    image: "/api/placeholder/400/300",
    promoted: true,
  },
];

export default function PropertyResults() {
  const [showGEL, setShowGEL] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const gelRate = 2.65;

  const formatPrice = (priceUSD) => {
    if (showGEL) {
      const priceGEL = priceUSD * gelRate;
      return `${priceGEL.toLocaleString()} ₾`;
    }
    return `$${priceUSD.toLocaleString()}`;
  };

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

  return (
    <div className="space-y-6">
      <Card className="p-6 mt-4 bg-gradient-to-b from-white to-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold bg-black bg-clip-text text-transparent">
              ხელმისაწვდომი ბინები
            </h2>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 px-4 py-1"
            >
              {propertyData.length} შედეგი
            </Badge>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <span className="text-sm font-medium text-gray-600">USD</span>
            <Switch
              checked={showGEL}
              onCheckedChange={setShowGEL}
              className="data-[state=checked]:bg-green-500"
            />
            <span className="text-sm font-medium text-gray-600">GEL</span>
          </div>
        </div>

        <div className="grid gap-6">
          {propertyData.map((property) => (
            <div
              key={property.id}
              className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="grid md:grid-cols-[300px,1fr] gap-6">
                {/* Image Section */}
                <div className="relative h-48 md:h-full overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.address}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {property.promoted && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-none">
                      VIP
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full ${
                      favorites.has(property.id)
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-500 hover:text-gray-600"
                    }`}
                    onClick={() => toggleFavorite(property.id)}
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </Button>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {property.address}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{property.metro}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(property.priceUSD)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.renovation}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Home className="w-4 h-4" />
                      <span>{property.area} მ²</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <BedDouble className="w-4 h-4" />
                      <span>{property.bedrooms} საძინებელი</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Sofa className="w-4 h-4" />
                      <span>{property.livingRoom}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DoorOpen className="w-4 h-4" />
                      <span>{property.floor} სართული</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
