"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function ApartmentList() {
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("3D");

  // Filters
  const [selectedBlock, setSelectedBlock] = useState("A");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [areaRange, setAreaRange] = useState({ min: "", max: "" });

  const [itemsToShow, setItemsToShow] = useState(12); // Start by showing 12 items
  const [currentPage, setCurrentPage] = useState(1);

  const getCurrentItems = () => {
    return filteredApartments.slice(0, itemsToShow); // Slice the array based on itemsToShow
  };

  const totalPages = Math.ceil(filteredApartments.length / itemsToShow);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setItemsToShow(12); // Reset items to show when filters change
  }, [selectedBlock, selectedFloor, selectedStatus, priceRange, areaRange]);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/apartments");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        if (data.status === "success") {
          setApartments(data.data || []);
          setFilteredApartments(data.data || []);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  // Filter effect
  useEffect(() => {
    let filtered = [...apartments];

    if (selectedBlock !== "all") {
      filtered = filtered.filter((apt) => apt.block_id === selectedBlock);
    }

    if (selectedFloor !== "all") {
      filtered = filtered.filter(
        (apt) => apt.floor === parseInt(selectedFloor)
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((apt) => apt.status === selectedStatus);
    }

    if (priceRange.min) {
      filtered = filtered.filter(
        (apt) => apt.price >= parseInt(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (apt) => apt.price <= parseInt(priceRange.max)
      );
    }

    if (areaRange.min) {
      filtered = filtered.filter(
        (apt) => apt.total_area >= parseInt(areaRange.min)
      );
    }
    if (areaRange.max) {
      filtered = filtered.filter(
        (apt) => apt.total_area <= parseInt(areaRange.max)
      );
    }

    setFilteredApartments(filtered);
  }, [
    apartments,
    selectedBlock,
    selectedFloor,
    selectedStatus,
    priceRange,
    areaRange,
  ]);

  // Helper functions
  const getUniqueBlocks = () =>
    [...new Set(apartments.map((apt) => apt.block_id))].sort();
  const getUniqueFloors = () =>
    [...new Set(apartments.map((apt) => apt.floor))].sort((a, b) => a - b);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500 text-white";
      case "sold":
        return "bg-red-500 text-white";
      case "reserved":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "ხელმისაწვდომი";
      case "sold":
        return "გაყიდული";
      case "reserved":
        return "დაჯავშნული";
      default:
        return "უცნობი";
    }
  };

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 12); // Increment the number of items to show by 12
  };

  // Scroll event listener to trigger lazy loading
  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;
    if (bottom && currentPage < totalPages) {
      handleLoadMore(); // Load more when scrolled to the bottom
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  if (loading)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-lg">იტვირთება...</div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );

  return (
    <section className="section pt-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filter Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ბლოკი
              </label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2"
              >
                <option value="all">ყველა ბლოკი</option>
                {getUniqueBlocks().map((block) => (
                  <option key={block} value={block}>
                    ბლოკი {block}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                სართული
              </label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2"
              >
                <option value="all">ყველა სართული</option>
                {getUniqueFloors().map((floor) => (
                  <option key={floor} value={floor}>
                    სართული {floor}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                სტატუსი
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2"
              >
                <option value="all">ყველა სტატუსი</option>
                <option value="available">ხელმისაწვდომი</option>
                <option value="reserved">დაჯავშნული</option>
                <option value="sold">გაყიდული</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ფართი (მ²)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="მინ"
                  value={areaRange.min}
                  onChange={(e) =>
                    setAreaRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-1/2 rounded-lg border border-gray-300 p-2"
                />
                <input
                  type="number"
                  placeholder="მაქს"
                  value={areaRange.max}
                  onChange={(e) =>
                    setAreaRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-1/2 rounded-lg border border-gray-300 p-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle & Results Count */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">ჩვენი ბინები</h2>
            <span className="text-sm text-gray-500">
              ნაპოვნია {filteredApartments.length} ბინა
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("2D")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === "2D"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              2D ვიზუალი
            </button>
            <button
              onClick={() => setActiveView("3D")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === "3D"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              3D ვიზუალი
            </button>
          </div>
        </div>

        {/* Apartments Grid */}
        {filteredApartments.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center bg-white rounded-xl">
            <div className="text-gray-500">ბინები ვერ მოიძებნა</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentItems().map((apartment) => (
              <Link
                href={`/apartment/${apartment.apartment_id}-apartment-${apartment.apartment_number}-floor-${apartment.floor}`}
                key={apartment.apartment_id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  {apartment.home_2d && apartment.home_3d ? (
                    <img
                      src={
                        activeView === "2D"
                          ? apartment.home_2d
                          : apartment.home_3d
                      }
                      alt={`ბინა ${apartment.apartment_number}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">სურათი არ არის</span>
                    </div>
                  )}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm ${getStatusColor(
                      apartment.status
                    )}`}
                  >
                    {getStatusText(apartment.status)}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">
                      ბინა {apartment.apartment_number}
                    </h3>
                    <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                      ბლოკი {apartment.block_id}
                    </span>
                  </div>

                  <div className="text-gray-600">
                    <div className="flex justify-between mb-2">
                      <span>სართული</span>
                      <span className="font-medium">{apartment.floor}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>საერთო ფართი</span>
                      <span className="font-medium">
                        {apartment.total_area} მ²
                      </span>
                    </div>
                    {apartment.price && (
                      <div className="flex justify-between">
                        <span>ფასი</span>
                        <span className="font-medium">${apartment.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {currentPage < totalPages && (
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-gray-800 text-white w-full hover:bg-gray-200 mt-8 mx-auto block my-8"
          >
            მეტის ნახვა
          </button>
        )}
      </div>
    </section>
  );
}
