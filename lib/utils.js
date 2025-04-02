import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getStatusStyle(status) {
  switch (status) {
    case "available":
      return "bg-green-100 border-green-200 text-green-700";
    case "sold":
      return "bg-blue-100 border-blue-200 text-blue-700";
    case "reserved":
      return "bg-amber-100 border-amber-200 text-amber-700";
    default:
      return "bg-gray-100 border-gray-200 text-gray-700";
  }
}

export function getStatusText(status, language) {
  // Debug info - log current request
  console.log(`getStatusText called with status: '${status}', language: '${language}'`);

  // More detailed logging to check language value
  console.log(`Language type: ${typeof language}, Language value: '${language}', Is English: ${language === "en"}`);

  const isEnglish = language === "en";

  // Log which branch we're taking
  console.log(`Using ${isEnglish ? 'English' : 'Georgian'} translation for status: ${status}`);

  switch (status) {
    case "available":
      return isEnglish ? "Available" : "ხელმისაწვდომი";
    case "sold":
      return isEnglish ? "Sold" : "გაყიდული";
    case "reserved":
      return isEnglish ? "Reserved" : "დაჯავშნილი";
    default:
      return status;
  }
}
