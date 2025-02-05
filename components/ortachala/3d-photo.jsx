"use client";
import Image from "next/image";

export default function GreenSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[800px] bg-green-100 py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">მზის ლოკაცია </h2>

        <div className="relative w-full h-[300px] md:h-[500px] mx-auto">
          <Image
            src="https://i.ibb.co/4wnf6qcW/ORTACHALA-HILLS-3.gif"
            alt="Feature GIF"
            fill
            unoptimized
            className="object-cover rounded-lg shadow-xl"
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
          />
        </div>
      </div>
    </section>
  );
}
