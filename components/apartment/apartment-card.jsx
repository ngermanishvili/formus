import Link from "next/link";
import LazyImage from "../common/LazyImage";
import { getStatusStyle, getStatusText } from "@/lib/utils";

export default function ApartmentCard({ apartment, activeView }) {
  const {
    status,
    apartment_number,
    block_id,
    floor,
    total_area,
    home_2d,
    home_3d,
    apartment_id,
  } = apartment;

  return (
    <Link
      href={`/apartment/${apartment_id}-apartment-${apartment_number}-floor-${floor}`}
      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-video">
        {home_2d && home_3d ? (
          <LazyImage
            src={activeView === "2D" ? home_2d : home_3d}
            alt={`ბინა ${apartment_number}`}
            className="absolute inset-0"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">სურათი არ არის</span>
          </div>
        )}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm text-white ${getStatusStyle(
            status
          )}`}
        >
          {getStatusText(status)}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
            ბინა {apartment_number}
          </h3>
          <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
            ბლოკი {block_id}
          </span>
        </div>

        <div className="space-y-2 text-gray-600">
          <div className="flex justify-between">
            <span>სართული</span>
            <span className="font-medium">{floor}</span>
          </div>
          <div className="flex justify-between">
            <span>საერთო ფართი</span>
            <span className="font-medium">{total_area} მ²</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
