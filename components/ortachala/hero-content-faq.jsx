"use client";
import Image from "next/image";
import Link from "next/link";

export default function FaqLeft() {
  return (
    <section className="relative bg-white">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Left Image */}
        <div className="w-full lg:w-1/2 relative h-[400px] group overflow-hidden">
          <Image
            src="/assets/imgs/page/homepage5/banner.png"
            alt="Luxride"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 px-8 lg:px-16 py-16 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-black mb-8 leading-tight">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
            nam numquam eaque vitae accusamus maxime ut quia nihil sequi dolore
            illo soluta recusandae necessitatibus.
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center text-lg font-medium text-white bg-black px-8 py-3 rounded-sm hover:bg-gray-800 transition-colors w-fit"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
