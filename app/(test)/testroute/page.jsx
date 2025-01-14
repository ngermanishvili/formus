import React from "react";
import OrtachalaPolygon from "./(components)/ortachala-polygon";
import Footer1 from "@/components/footers/Footer1";

const Test = () => {
  return (
    <div className="min-h-[800px] flex flex-col bg-black  overflow-hidden">
      <div className="flex-1 w-full">
        <OrtachalaPolygon />
      </div>
      <Footer1 />
    </div>
  );
};

export default Test;
