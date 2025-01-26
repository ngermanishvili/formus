// app/[locale]/homes-list/page.jsx
"use client";

import ApartmentList from "@/components/fleet-list/ApartmentList";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import { useSearchParams } from "next/navigation";

export default function HomesListPage() {

  
  const searchParams = useSearchParams();
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
      <Header1 />
      <MobailHeader1 />
      <main className="main">
        <ApartmentList initialFilters={initialFilters} />
      </main>
      <Footer1 />
    </>
  );
}
