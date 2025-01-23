"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

const ITEMS_PER_PAGE = 12;
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

const statusConfig = {
  available: { text: "ხელმისაწვდომი", color: "bg-green-500" },
  sold: { text: "გაყიდული", color: "bg-red-500" },
  reserved: { text: "დაჯავშნული", color: "bg-yellow-500" },
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
  if (quality) params.push(`q_${quality}`);
  return `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${params.join(
    ","
  )}/${src}`;
};

export default function ApartmentList() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("3D");
  const [filters, setFilters] = useState({
    block: "all",
    floor: "all",
    status: "all",
    priceMin: "",
    priceMax: "",
    areaMin: "",
    areaMax: "",
  });
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  // Memoized filter functions
  const filterApartments = useCallback(
    (apts) => {
      return apts.filter((apt) => {
        return (
          (filters.block === "all" || apt.block_id === filters.block) &&
          (filters.floor === "all" || apt.floor === parseInt(filters.floor)) &&
          (filters.status === "all" || apt.status === filters.status) &&
          (!filters.priceMin || apt.price >= parseInt(filters.priceMin)) &&
          (!filters.priceMax || apt.price <= parseInt(filters.priceMax)) &&
          (!filters.areaMin || apt.total_area >= parseInt(filters.areaMin)) &&
          (!filters.areaMax || apt.total_area <= parseInt(filters.areaMax))
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

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setVisibleItems(ITEMS_PER_PAGE);
  }, []);

  const getUniqueValues = useCallback(
    (field, numeric = false) => {
      const values = [...new Set(apartments.map((apt) => apt[field]))];
      return numeric ? values.sort((a, b) => a - b) : values.sort();
    },
    [apartments]
  );

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <section className="section pt-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <FilterSection
          filters={filters}
          onChange={handleFilterChange}
          getValues={getUniqueValues}
        />

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
  );
}

// Sub-components
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

const FilterSection = ({ filters, onChange, getValues }) => (
  <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SelectFilter
        label="ბლოკი"
        value={filters.block}
        options={["all", ...getValues("block_id")]}
        format={(v) => `ბლოკი ${v}`}
        onChange={(v) => onChange("block", v)}
      />

      <SelectFilter
        label="სართული"
        value={filters.floor}
        options={["all", ...getValues("floor", true)]}
        format={(v) => `სართული ${v}`}
        onChange={(v) => onChange("floor", v)}
      />

      <SelectFilter
        label="სტატუსი"
        value={filters.status}
        options={[
          "all",
          ...Object.keys(statusConfig).filter((k) => k !== "default"),
        ]}
        format={(v) => statusConfig[v].text}
        onChange={(v) => onChange("status", v)}
      />

      <RangeFilter
        label="ფართი (მ²)"
        min={filters.areaMin}
        max={filters.areaMax}
        onMinChange={(v) => onChange("areaMin", v)}
        onMaxChange={(v) => onChange("areaMax", v)}
      />
    </div>
  </div>
);

const SelectFilter = ({ label, value, options, format, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 p-2"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === "all" ? `ყველა ${label.toLowerCase()}` : format(opt)}
        </option>
      ))}
    </select>
  </div>
);

const RangeFilter = ({ label, min, max, onMinChange, onMaxChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="flex gap-2">
      <input
        type="number"
        placeholder="მინ"
        value={min}
        onChange={(e) => onMinChange(e.target.value)}
        className="w-1/2 rounded-lg border border-gray-300 p-2"
      />
      <input
        type="number"
        placeholder="მაქს"
        value={max}
        onChange={(e) => onMaxChange(e.target.value)}
        className="w-1/2 rounded-lg border border-gray-300 p-2"
      />
    </div>
  </div>
);

const HeaderSection = ({ count, activeView, setView }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <div className="flex items-center gap-4">
      <h2 className="text-2xl font-semibold">ჩვენი ბინები</h2>
      <span className="text-sm text-gray-500">ნაპოვნია {count} ბინა</span>
    </div>

    <div className="flex gap-2">
      {["2D", "3D"].map((view) => (
        <button
          key={view}
          onClick={() => setView(view)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeView === view
              ? "bg-black text-white"
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
      className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
    >
      მეტის ნახვა
    </button>
  </div>
);
