import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getStatusStyle(status) {
  switch (status) {
    case "available":
      return "bg-green-600";
    case "sold":
      return "bg-red-600";
    case "reserved":
      return "bg-yellow-600";
    default:
      return "bg-gray-600";
  }
}

export function getStatusText(status, language = "ka") {
  const isEnglish = language === "en";

  switch (status) {
    case "available":
      return isEnglish ? "Available" : "თავისუფალი";
    case "sold":
      return isEnglish ? "Sold" : "გაყიდული";
    case "reserved":
      return isEnglish ? "Reserved" : "დაჯავშნილი";
    default:
      return status;
  }
}
