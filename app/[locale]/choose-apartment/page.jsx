//app/choose-apartment/page.jsx
import React from "react";
import OrtachalaPolygon from "../(test)/testroute/(components)/ortachala-polygon";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";

const ChooseApartment = () => {
  return (
    <div className="flex flex-col bg-black  overflow-hidden">
      <Header1 />
      <div className="flex-1 w-full">
        <OrtachalaPolygon />
      </div>
      <Footer1 />
    </div>
  );
};

export default ChooseApartment;
