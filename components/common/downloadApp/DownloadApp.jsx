"use client";

import SearchForm from "@/components/search/search-form";
import Image from "next/image";

export default function DownloadApp() {
  return (
    <section className="min-h-[600px] bg-[#abc188] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 animate-fade-in">
            Find Your Dream House
          </h2>

          <div className="p-8 rounded-2xl">
            <SearchForm />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      </div>
    </section>
  );
}
