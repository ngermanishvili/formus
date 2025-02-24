"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import SecondShape1 from "@/public/assets/shapes/project/3.png";
import EnergyEfficiency from "@/public/assets/ortachala-project/1-energo.png";
import EssentialFacilities from "@/public/assets/ortachala-project/3-everyday-life.png";
import RecreationArea from "@/public/assets/ortachala-project/4-recreation.png";
import Security from "@/public/assets/ortachala-project/2-teritory-security.png";

const InteractiveSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const params = useParams();
  const locale = params.locale || "ka";

  const translations = {
    services: {
      en: "Services",
      ka: "სერვისები",
    },
  };

  const sections = [
    {
      title: {
        en: "Energy Efficiency",
        ka: "ენერგოეფექტურობა",
      },
      description: {
        en: 'The construction of "Ortachala Hills" is being carried out using environmentally friendly and energy-efficient materials that feature high thermal and sound insulation properties. Energy efficiency significantly reduces heating, cooling and electricity costs.',
        ka: "ორთაჭალა ჰილსის მშენებლობა მიმდინარეობს ეკოლოგიური და ენერგოეფექტური სამშენებლო მასალებით, რომლებიც მაღალი თბოიზოლაციური და ხმის იზოლაციური თვისებებით გამოირჩევიან. ენერგოეფექტურობა მნიშვნელოვნად ამცირებს გათბობის, გაგრილებისა და ელექტროენერგიის ხარჯებს.",
      },
      image: "/assets/ortachala-project/1-energo.png",
    },
    {
      title: {
        en: "Essential facilities in one place",
        ka: "ყოველდღიური ცხოვრებისთვის აუცილებელი ობიექტები ერთ სივრცეში",
      },
      description: {
        en: "The residential complex will include a supermarket, pharmacy, gastro space, beauty salon and other commercial facilities to meet daily living needs.",
        ka: "საცხოვრებელი კომპლექსის ტერიტორიაზე გათვალისწინებულია სუპერმარკეტი, აფთიაქი, გასტრო სივრცე, სილამაზის ცენტრი და სხვა კომერციული ობიექტები.",
      },
      image: "/assets/ortachala-project/3-everyday-life.png",
    },
    {
      title: {
        en: "3,000 m² internal recreational area",
        ka: "3 000 მ2 შიდა რეკრეაციული ზონა",
      },
      description: {
        en: "The internal recreational area features walking paths, relaxation spaces, a children's playground and cycling lanes.",
        ka: "შიდა რეკრეაციული ზონა მოიცავს სასეირნო ბილიკებს, მოსასვენებელ სივრცეებს, საბავშვო სათამაშო მოედანს და ველო ბილიკებს.",
      },
      image: "/assets/ortachala-project/4-recreation.png",
    },
    {
      title: {
        en: "24/7 full security",
        ka: "სრული ტერიტორიის დაცვა 24/7",
      },
      description: {
        en: "The residential complex is a gated community, fully equipped with security cameras and offering round-the-clock security.",
        ka: "საცხოვრებელი კომპლექსი დახურული ტიპისაა და სრულად აღჭურვილია დაცვის კამერებით.",
      },
      image: "/assets/ortachala-project/2-teritory-security.png",
    },
  ];

  return (
    <section className="relative bg-background">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 relative h-screen lg:h-[500px] group overflow-hidden">
          <Image
            src={sections[activeIndex].image}
            alt={sections[activeIndex].title[locale]}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="w-full lg:w-1/2 relative">
          <div className="px-6 lg:px-12 xl:px-16 py-12 lg:py-16 h-full flex">
            <div className="flex-1">
              {/* <h2 className="text-sm text-black mb-2">
                {translations.services[locale]}
              </h2> */}
              <div className="max-w-xl">
                <h2 className="font-firago font-bold text-3xl lg:text-3xl text-foreground mb-6 lg:mb-8 leading-tight">
                  {sections[activeIndex].title[locale]}
                </h2>
                <p className="font-firago   lg:text-lg font-light">
                  {sections[activeIndex].description[locale]}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 mr-8">
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all z-10",
                    activeIndex === index
                      ? "border-transparent bg-primary text-white"
                      : "border-gray-300 hover:border-primary"
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div
            className="hidden lg:block absolute bottom-[-12px] right-0 w-[400px] xl:w-[400px]"
            style={{ zIndex: 10, pointerEvents: "none" }}
          >
            <Image src={SecondShape1} alt="Shape" className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;
