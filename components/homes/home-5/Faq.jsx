"use client";
import Image from "next/image";
import Link from "next/link";

export default function Faq() {
  return (
    <section className="relative bg-white">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Left Image */}
        <div className="w-full lg:w-1/2 relative h-[600px] group overflow-hidden">
          <Image
            src="/assets/imgs/page/homepage5/banner.png"
            alt={t("title")}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 px-8 lg:px-16 py-16 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-black mb-8 leading-tight">
            Lorem ipsum dolor sit amet.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            {/* {t("description")} */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt
            cumque quia rem, porro aperiam ullam quos veniam quibusdam a impedit
            esse aliquid. Animi perspiciatis ex voluptas voluptatum ullam
            repellendus neque vel consectetur placeat, eos in excepturi nostrum
            quo atque! Modi minima explicabo, quibusdam perferendis neque
            impedit. Reprehenderit, voluptates quidem. Temporibus!
          </p>
          <Link href="/faq">
            <span className="inline-block text-lg text-white bg-black px-8 py-3 rounded-sm hover:bg-gray-800 transition-colors">
              {/* {t("button")} */}
              lorem
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
