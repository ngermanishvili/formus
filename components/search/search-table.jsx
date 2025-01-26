import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, BedDouble, Sofa, DoorOpen, MapPin, Heart } from "lucide-react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";

export default function PropertyResults() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGEL, setShowGEL] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const gelRate = 2.65;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/apartments");
        const { data } = await response.json();
        const blockAProperties = data
          .filter((property) => property.block_id === "A")
          .slice(0, 5);
        setProperties(blockAProperties);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const formatPrice = (priceUSD) => {
  //   if (showGEL) {
  //     const priceGEL = priceUSD * gelRate;
  //     return `${priceGEL.toLocaleString()} ₾`;
  //   }
  //   return `$${priceUSD.toLocaleString()}`;
  // };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
              {properties.length} შედეგი
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
          {properties.map((property) => (
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

                <div className="p-6">
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
                      {/* <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(property.price)}
                      </div> */}
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
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
