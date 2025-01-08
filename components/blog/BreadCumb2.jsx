import Link from "next/link";
import React from "react";

export default function BreadCumb2() {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-4">
      <div className="absolute inset-0 bg-black/30" />
      <div className="mx-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-medium text-white mb-5 animate-fade-in">
          Ortachala Hills
        </h1>
        <div className="flex items-center space-x-3 text-white/80">
          <Link
            href="/"
            className="hover:text-white transition-colors duration-200"
          >
            მთავარი
          </Link>
          <span className="text-white/50">›</span>
          <Link
            href="/blog-single/1"
            className="hover:text-white transition-colors duration-200"
          >
            პროექტის დეტალები
          </Link>
        </div>
      </div>
      {/* დეკორატიული ელემენტები */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-30" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300 rounded-full filter blur-2xl opacity-10" />
    </div>
  );
}
