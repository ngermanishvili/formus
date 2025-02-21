"use client";

import { useState, useEffect } from "react";
import ApartmentList from "@/components/fleet-list/ApartmentList";
import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import { useSearchParams } from "next/navigation";

export default function HomesListPage() {
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const initialFilters = {
    floor: [
      parseInt(searchParams.get("floorMin") || "1"),
      parseInt(searchParams.get("floorMax") || "20"),
    ],
    totalArea: [
      parseInt(searchParams.get("totalAreaMin") || "20"),
      parseInt(searchParams.get("totalAreaMax") || "200"),
    ],
    price: [
      parseInt(searchParams.get("priceMin") || "50000"),
      parseInt(searchParams.get("priceMax") || "500000"),
    ],

    status: searchParams.get("status") || "all",
    blockId: searchParams.get("blockId") || "",
  };

  return (
    <>
      <main className="main">
        <ApartmentList initialFilters={initialFilters} />
      </main>
    </>
  );
}
