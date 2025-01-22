//app/choose-apartment/page.jsx
import React from "react";
import OrtachalaPolygon from "../(test)/testroute/(components)/ortachala-polygon";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";

const ChooseApartment = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header1 />
      <main className="flex-1 w-full relative">
        <OrtachalaPolygon />
      </main>
      <Footer1 />
    </div>
  );
};
export default ChooseApartment;
