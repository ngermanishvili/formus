"use client";
import Image from "next/image";

export default function GreenSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[800px] bg-green-100 py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">მზის ლოკაცია </h2>

        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto">
          <Image
            src="/assets/imgs/page/homepage5/banner.png"
            alt="Feature Image"
            fill
            className="object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
