"use client";
import React from "react";
import { CircleLoader } from "react-spinners";

const LoadingOverlay = () => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center p-4">
        <CircleLoader color="#91B48C" size={50} speedMultiplier={0.8} />
      </div>
    </div>
  );
};

export default LoadingOverlay;
