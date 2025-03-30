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
      blocks: searchParams.get("blocks")?.split(",") || [],
      floors: searchParams.get("floors")?.split(",").map(Number) || [],
      statuses: searchParams.get("statuses")?.split(",") || [],
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
        const blockMatch =
          filters.blocks.length === 0 || filters.blocks.includes(apt.block_id);

        const floorMatch =
          filters.floors.length === 0 || filters.floors.includes(apt.floor);

        const statusMatch =
          filters.statuses.length === 0 ||
          filters.statuses.includes(apt.status);

        // Add area filter
        const areaMatch =
          apt.total_area >= filters.totalArea.min &&
          apt.total_area <= filters.totalArea.max;

        return blockMatch && floorMatch && statusMatch && areaMatch;
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
        const cacheKey = "apartments";
        const cached = localStorage.getItem(cacheKey);
        const now = Date.now();

        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (now - timestamp < CACHE_TTL) {
            setApartments(data);
            setLoading(false);
            return;
          }
        }

        const res = await fetch("/api/apartments");
        if (!res.ok) throw new Error("Failed to fetch");

        const { data } = await res.json();
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data, timestamp: now })
        );
        setApartments(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <>
      <section className="section pt-16 bg-gray-50 mb-16">
        <div className="container mx-auto px-4 flex justify-center items-center mt-8 md:mt-12 lg:mt-[100px] mb-8">
          <FloorFilters />
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
        ბლოკი {apt.block_id}
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
  <div className="min-h-[200px] flex items-center justify-center bg-white rounded-xl">
    <div className="text-gray-500">ბინები ვერ მოიძებნა</div>
  </div>
);

const LoadMoreButton = ({ onClick }) => (
  <div className="mt-8 flex justify-center">
    <button
      onClick={onClick}
      className="px-6 py-2  text-white rounded-full bg-[#00326b] transition-colors"
    >
      მეტის ნახვა
    </button>
  </div>
);
