"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { useSearchParams } from "next/navigation";
import FloorFilters from "../apartment/floor-filters";

const ITEMS_PER_PAGE = 12;
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

const statusConfig = {
  available: { text: "ხელმისაწვდომი", color: "bg-[#a2c080]" },
  sold: { text: "გაყიდული", color: "bg-[#f94011]" },
  reserved: { text: "დაჯავშნილი", color: "bg-yellow-500" },
  default: { text: "უცნობი", color: "bg-gray-500" },
};

const cloudinaryLoader = ({ src, width, quality }) => {
  const params = [
    "f_auto",
    "q_auto",
    "dpr_auto",
    "w_" + width,
    "c_limit",
    "g_auto",
  ];

  // Add caching parameters
  params.push("fl_immutable");
  params.push("fl_lossy");

  if (quality) params.push(`q_${quality}`);

  // Replace YOUR_CLOUD_NAME with the actual cloud name from env variable
  return `https://res.cloudinary.com/ds9dsumwl/image/upload/${params.join(
    ","
  )}/${src}`;
};

export default function ApartmentList() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("3D");
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const searchParams = useSearchParams();

  // Updated filters section in ApartmentList component
  const filters = useMemo(
    () => ({
      projects: searchParams.get("projects")?.split(",").filter(Boolean) || [],
      blocks: searchParams.get("blocks")?.split(",").filter(Boolean) || [],
      floors:
        searchParams.get("floors")?.split(",").map(Number).filter(Boolean) ||
        [],
      statuses: searchParams.get("statuses")?.split(",").filter(Boolean) || [],
      totalArea: {
        min: parseInt(searchParams.get("totalAreaMin")) || 0,
        max: parseInt(searchParams.get("totalAreaMax")) || Infinity,
      },
    }),
    [searchParams]
  );

  // Updated filter function
  const filterApartments = useCallback(
    (apts) => {
      return apts.filter((apt) => {
        // Make sure apt exists and has required properties
        if (!apt) return false;

        const projectMatch =
          !filters.projects ||
          filters.projects.length === 0 ||
          (apt.project_id !== undefined &&
            apt.project_id !== null &&
            filters.projects.includes(String(apt.project_id)));

        // Make block comparison case insensitive
        const blockMatch =
          !filters.blocks ||
          filters.blocks.length === 0 ||
          (apt.block_id &&
            filters.blocks
              .map((b) => b.toUpperCase())
              .includes(apt.block_id.toUpperCase())) ||
          (apt.block_name &&
            filters.blocks
              .map((b) => b.toUpperCase())
              .includes(apt.block_name.toUpperCase()));

        const floorMatch =
          !filters.floors ||
          filters.floors.length === 0 ||
          (apt.floor !== undefined && filters.floors.includes(apt.floor));

        const statusMatch =
          !filters.statuses ||
          filters.statuses.length === 0 ||
          (apt.status && filters.statuses.includes(apt.status));

        // Add area filter with null checks
        const totalArea = apt.total_area || 0;
        const areaMatch =
          !filters.totalArea ||
          (totalArea >= (filters.totalArea.min || 0) &&
            totalArea <= (filters.totalArea.max || Infinity));

        return (
          projectMatch && blockMatch && floorMatch && statusMatch && areaMatch
        );
      });
    },
    [filters]
  );

  const filteredApartments = useMemo(
    () => filterApartments(apartments),
    [apartments, filterApartments]
  );

  const currentItems = useMemo(
    () => filteredApartments.slice(0, visibleItems),
    [filteredApartments, visibleItems]
  );

  const hasMore = useMemo(
    () => visibleItems < filteredApartments.length,
    [visibleItems, filteredApartments.length]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always clear cache when filters change to ensure fresh data
        const cacheKey = "apartments";
        localStorage.removeItem(cacheKey);

        // Build API URL with all filters
        let apiURL = "/api/apartments";

        // Add filter parameters if they exist
        const params = new URLSearchParams();

        // Include project_id parameter if projects are selected
        if (filters.projects && filters.projects.length > 0) {
          const projectId = filters.projects[0];
          params.append("project_id", projectId);
          console.log(`Filtering by project_id: ${projectId}`);
        } else {
          console.log("No project selected in filters");
        }

        // If blocks are specified, add them to query
        if (filters.blocks && filters.blocks.length > 0) {
          // Normalize block values to be A, B, D
          const normalizedBlocks = filters.blocks.map((block) =>
            String(block).trim().toUpperCase()
          );
          params.append("blocks", normalizedBlocks.join(","));
          console.log(`Filtering by blocks: ${normalizedBlocks.join(",")}`);
        } else {
          console.log("No blocks selected in filters");
        }

        // If floors are specified, add them to query
        if (filters.floors && filters.floors.length > 0) {
          params.append("floors", filters.floors.join(","));
          console.log(`Filtering by floors: ${filters.floors.join(",")}`);
        }

        // If statuses are specified, add them to query
        if (filters.statuses && filters.statuses.length > 0) {
          params.append("statuses", filters.statuses.join(","));
          console.log(`Filtering by statuses: ${filters.statuses.join(",")}`);
        }

        // If we have parameters, add them to the URL
        if (params.toString()) {
          apiURL += `?${params.toString()}`;
        }

        console.log(`Fetching from: ${apiURL}`);
        const res = await fetch(apiURL);

        if (!res.ok) throw new Error("Failed to fetch");

        const { data } = await res.json();
        console.log("Fetched apartments:", data.length);

        if (data.length > 0) {
          // Check first apartment block data
          console.log("First apartment block data:", {
            block_id: data[0].block_id,
            block_name: data[0].block_name,
            block_id_type: typeof data[0].block_id,
            block_id_length: data[0].block_id?.length || 0,
          });

          // Log unique blocks with more details
          const uniqueBlocks = [...new Set(data.map((apt) => apt.block_id))];
          console.log("Unique blocks in fetched data:", uniqueBlocks);

          // Check specifically for D block
          const dBlockApts = data.filter(
            (apt) =>
              apt.block_id === "D" ||
              apt.block_id === "d" ||
              apt.block_name === "D" ||
              apt.block_name === "Block D"
          );
          console.log(`Found ${dBlockApts.length} apartments in D block`);
          if (dBlockApts.length > 0) {
            console.log("Sample D block apartment:", dBlockApts[0]);
          }

          // Debug block filter issue
          if (filters.blocks.includes("D")) {
            console.log("D block is requested in filters");

            // Check raw data for D block apartments
            const allDInData = data.filter(
              (apt) => apt.block_id?.toUpperCase() === "D"
            );
            console.log(
              `Found ${allDInData.length} D block apartments in raw data`
            );

            // Check if they're getting filtered out
            const filteredD = filterApartments(allDInData);
            console.log(
              `After filtering, ${filteredD.length} D block apartments remain`
            );

            if (allDInData.length > 0 && filteredD.length === 0) {
              // Deep debug the first D block apartment
              const sampleD = allDInData[0];
              console.log(
                "Sample D block apartment that's being filtered out:",
                sampleD
              );

              // Check each filter condition individually
              const projectMatch =
                !filters.projects.length ||
                filters.projects.includes(String(sampleD.project_id));

              const blockMatch =
                !filters.blocks.length ||
                filters.blocks
                  .map((b) => b.toUpperCase())
                  .includes(sampleD.block_id?.toUpperCase());

              const floorMatch =
                !filters.floors.length ||
                filters.floors.includes(sampleD.floor);

              const statusMatch =
                !filters.statuses.length ||
                filters.statuses.includes(sampleD.status);

              const areaMatch =
                !filters.totalArea ||
                (sampleD.total_area >= (filters.totalArea.min || 0) &&
                  sampleD.total_area <= (filters.totalArea.max || Infinity));

              console.log("Filter conditions for D block sample:", {
                projectMatch,
                blockMatch,
                floorMatch,
                statusMatch,
                areaMatch,
                filters,
              });
            }
          }
        }

        console.log(
          "Sample apartment data structure:",
          data.length > 0 ? data[0] : "No data"
        );
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data, timestamp: Date.now() })
        );
        setApartments(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.blocks, filters.projects, filters.floors, filters.statuses]);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <>
      <section className="section pt-16 bg-gray-50 mb-16">
        <div className="container mx-auto px-4 flex justify-center items-center mt-8 md:mt-12 lg:mt-[100px] mb-8">
          <FloorFilters
            initialFilters={filters}
            onSearch={(newFilters) => {
              // Re-fetch data if needed
              if (JSON.stringify(filters) !== JSON.stringify(newFilters)) {
                // Re-fetch will happen automatically thanks to the dependency array in useEffect
                // No need to fetch directly here
              }
            }}
          />
        </div>
        <div className="container mx-auto px-4">
          <HeaderSection
            count={filteredApartments.length}
            activeView={activeView}
            setView={setActiveView}
          />

          {currentItems.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <ApartmentGrid items={currentItems} activeView={activeView} />
              {hasMore && (
                <LoadMoreButton onClick={() => setVisibleItems((p) => p + 8)} />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

const LoadingIndicator = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="text-lg">იტვირთება...</div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="text-red-500">{message}</div>
  </div>
);

const HeaderSection = ({ count, activeView, setView }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <div className="flex items-center gap-4">
      {/* <h2 className="text-2xl font-semibold">ჩვენი ბინები</h2> */}
      <span className="text-sm text-gray-500">ნაპოვნია {count} ბინა</span>
    </div>

    <div className="flex gap-2">
      {["2D", "3D"].map((view) => (
        <button
          key={view}
          onClick={() => setView(view)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeView === view
              ? "bg-[#00326b] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {view} ვიზუალი
        </button>
      ))}
    </div>
  </div>
);

const ApartmentGrid = ({ items, activeView }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((apt, index) => (
      <ApartmentCard
        key={apt.apartment_id}
        apt={apt}
        index={index}
        view={activeView}
      />
    ))}
  </div>
);

const ApartmentCard = ({ apt, index, view }) => {
  const imageUrl = apt[`home_${view.toLowerCase()}`];
  const status = statusConfig[apt.status] || statusConfig.default;

  return (
    <Link
      href={`/apartment/${apt.apartment_id}-${apt.apartment_number}-${apt.floor}`}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video">
        {imageUrl ? (
          <CldImage
            src={imageUrl}
            alt={`ბინა ${apt.apartment_number}`}
            width={800}
            height={600}
            loader={cloudinaryLoader}
            priority={index < 4}
            loading={index < 4 ? "eager" : "lazy"}
            quality={60}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            fetchPriority={index < 4 ? "high" : "auto"}
            unoptimized={false}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4="
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">სურათი არ არის</span>
          </div>
        )}
        <StatusBadge status={status} />
      </div>

      <CardContent apt={apt} />
    </Link>
  );
};

const StatusBadge = ({ status }) => (
  <div
    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm ${status.color} text-white`}
  >
    {status.text}
  </div>
);

const CardContent = ({ apt }) => (
  <div className="p-4">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold">ბინა {apt.apartment_number}</h3>
      <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
        ბლოკი {apt.block_name}
      </span>
    </div>

    <div className="text-gray-600 space-y-2">
      <InfoRow label="სართული" value={apt.floor} />
      <InfoRow label="ფართი" value={`${apt.total_area} მ²`} />
      {apt.price && <InfoRow label="ფასი" value={`$${apt.price}`} />}
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const EmptyState = () => (
  <div className="min-h-[200px] flex flex-col items-center justify-center bg-white rounded-xl shadow p-6 gap-4">
    <div className="text-gray-500">ბინები ვერ მოიძებნა</div>
    <div className="text-sm text-gray-400 text-center">
      გთხოვთ, შეცვალოთ ფილტრის პარამეტრები საძიებლად
    </div>
  </div>
);

const LoadMoreButton = ({ onClick }) => (
  <div className="mt-8 flex justify-center">
    <button
      onClick={onClick}
      className="px-6 py-2 text-white rounded-full bg-[#00326b] transition-colors hover:bg-[#002456]"
    >
      მეტის ნახვა
    </button>
  </div>
);
