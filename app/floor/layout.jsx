"use client";

import Footer1 from "@/components/footers/Footer1";

export default function FloorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* მთავარი კონტენტი */}
      <div className="">{children}</div>
      <Footer1 />
    </div>
  );
}
