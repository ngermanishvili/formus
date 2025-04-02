import { memo } from "react";
import { getStatusText, getStatusStyle } from "@/lib/utils";
import { useParams } from "next/navigation";

// Define the RoomAreas component
const RoomAreas = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {data.living_room_area > 0 && (
        <div className="text-sm">
          <span className="text-gray-500">სამზარეულო + მისაღები:</span>
          <p className="font-semibold">{data.living_room_area} მ²</p>
        </div>
      )}

      {data.bedroom_area > 0 && (
        <div className="text-sm">
          <span className="text-gray-500">საძინებელი 1:</span>
          <p className="font-semibold">{data.bedroom_area} მ²</p>
        </div>
      )}

      {data.bedroom2_area > 0 && (
        <div className="text-sm">
          <span className="text-gray-500">საძინებელი 2:</span>
          <p className="font-semibold">{data.bedroom2_area} მ²</p>
        </div>
      )}

      {data.bathroom_area > 0 && (
        <div className="text-sm">
          <span className="text-gray-500">სველი წერტილი:</span>
          <p className="font-semibold">{data.bathroom_area} მ²</p>
        </div>
      )}

      {data.balcony_area > 0 && (
        <div className="text-sm">
          <span className="text-gray-500">აივანი:</span>
          <p className="font-semibold">{data.balcony_area} მ²</p>
        </div>
      )}
    </div>
  );
};

const InfoPanel = memo(({ data, onViewDetails }) => {
  if (!data) return null;

  const params = useParams();
  const locale = params?.locale || "ka";

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "sold":
        return "bg-red-500";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full bg-gray-200 rounded-xl shadow-lg overflow-hidden lg:max-w-sm">
      <div className="relative w-full">
        <img
          src={data.photo_3d || data.photo_2d}
          alt={`Apartment ${data.apartment_number}`}
          className="w-full h-48 md:h-56 lg:h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg text-white font-bold">
                ბინა {data.apartment_number}
              </h3>
              <span className="text-white">{data.total_area} მ²</span>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(
                data.status
              )}`}
            >
              {getStatusText(data.status, locale)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-3">
        <RoomAreas data={data} />
        <button
          onClick={() => onViewDetails(data)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
        >
          დეტალურად ნახვა
        </button>
      </div>
    </div>
  );
});

export default InfoPanel;
