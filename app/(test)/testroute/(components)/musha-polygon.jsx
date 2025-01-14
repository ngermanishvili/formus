import React from "react";
import sarajishviliImg from "@/public/assets/sarajishvili.jpg";

const ResponsiveImageMap = () => {
  // ორიგინალი კოორდინატები 3840x2160 სურათიდან
  const polygonPoints =
    "1655,897 2402,744 2629,883 2629,1009 2402,890 1659,1022";

  return (
    <div className="relative max-w-[1200px]">
      <img
        src={sarajishviliImg.src}
        alt="Sarajishvili"
        width={3840}
        height={2160}
        className="w-full h-auto"
      />
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 3500 2160"
        preserveAspectRatio="xMinYMin meet"
      >
        <polygon
          points={polygonPoints}
          className="fill-transparent stroke-transparent hover:fill-blue-500/30 hover:stroke-blue-500 stroke-2 transition-all duration-200 cursor-pointer"
        />
      </svg>
    </div>
  );
};

export default ResponsiveImageMap;
