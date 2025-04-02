"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, BedDouble, Sofa, DoorOpen, MapPin } from "lucide-react";
import { CldImage } from "next-cloudinary";

export default function PropertyResults() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/apartments");
        const { data } = await response.json();
        const availableProperties = data
          .filter((property) => property.status !== "sold")
          .slice(0, 5);
        setProperties(availableProperties);
      } catch (error) {
        console.error("შეცდომა:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                    alt={`ბინა ${property.apartment_id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        ბლოკი {property.block_id}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>სართული {property.floor}</span>
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
                      <span>სართული {property.floor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Sofa className="w-4 h-4" />
                      <span className="hover:text-black text-black">
                        {" "}
                        {property.block_id}
                      </span>
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
