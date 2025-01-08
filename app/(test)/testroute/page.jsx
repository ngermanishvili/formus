import React from "react";
import polygonPhoto from "@/public/pologon-sarajishvili.jpg";

const SarajishviliPolygonComponent = () => {
  return (
    <div className="relative w-full">
      <img
        src={polygonPhoto.src}
        alt="Sarajishvili map"
        className="w-full h-auto"
      />
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 2816 849"
        preserveAspectRatio="xMinYMin meet"
      >
        <path
          d="M 1035,849 
             L 2330,512 
             L 2398,504 
             L 2415,512 
             L 2619,648 
             L 2812,797 
             L 2313,431 
             L 1041,780 
             L 2615,563 
             L 2816,739 
             L 2412,420 
             L 2395,505 
             Z"
          className="fill-blue-500/20 hover:fill-blue-500/40 transition-colors duration-200 cursor-pointer"
        />
      </svg>
    </div>
  );
};

export default SarajishviliPolygonComponent;
