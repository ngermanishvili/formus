import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SecondShape1 from "@/public/assets/shapes/project/3.png";

const InteractiveSection = ({ projectData, currentLang }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Demo content array with multiple sections
  const sections = [
    {
      title: projectData.second_section_title,
      description: projectData.second_section_description,
      image:
        projectData.second_section_img ||
        "/assets/imgs/page/homepage5/banner.png",
    },
    {
      title:
        currentLang === "ge" ? "მშენებლობის პროცესი" : "Construction Process",
      description:
        currentLang === "ge"
          ? "ჩვენი გუნდი იყენებს თანამედროვე ტექნოლოგიებს და მაღალი ხარისხის მასალებს მშენებლობის პროცესში, რაც უზრუნველყოფს პროექტის მაღალ ხარისხს და გამძლეობას."
          : "Our team employs modern technologies and high-quality materials in the construction process, ensuring project durability and excellence.",
      image: "/assets/imgs/page/homepage5/banner.png",
    },
    {
      title: currentLang === "ge" ? "ინტერიერის დიზაინი" : "Interior Design",
      description:
        currentLang === "ge"
          ? "ჩვენი დიზაინერები ქმნიან უნიკალურ და თანამედროვე ინტერიერებს, რომლებიც მორგებულია თქვენს გემოვნებასა და საჭიროებებზე."
          : "Our designers create unique and modern interiors tailored to your taste and needs.",
      image: "/assets/imgs/page/homepage5/banner.png",
    },
    {
      title:
        currentLang === "ge" ? "გარე სივრცის მოწყობა" : "Exterior Development",
      description:
        currentLang === "ge"
          ? "პროექტი მოიცავს მწვანე სივრცეების, სარეკრეაციო ზონებისა და პარკინგის მოწყობას, რაც ქმნის კომფორტულ საცხოვრებელ გარემოს."
          : "The project includes green spaces, recreational areas, and parking facilities, creating a comfortable living environment.",
      image: "/assets/imgs/page/homepage5/banner.png",
    },
  ];

  return (
    <section className="relative bg-background">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 relative h-screen lg:h-[500px] group overflow-hidden">
          <Image
            src={sections[activeIndex].image}
            alt={sections[activeIndex].title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="w-full lg:w-1/2 relative">
          <div className="px-6 lg:px-12 xl:px-16 py-12 lg:py-16 h-full flex">
            <div className="flex-1">
              <h2 className="text-sm text-black mb-2">Services</h2>
              <div className="max-w-xl">
                <h2 className="font-firago font-bold text-3xl lg:text-4xl text-foreground mb-6 lg:mb-8 leading-tight">
                  {sections[activeIndex].title}
                </h2>
                <p className="font-firago font-light text-muted-foreground text-base lg:text-lg leading-relaxed">
                  {sections[activeIndex].description}
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
            className="hidden lg:block absolute  bottom-[-12px] right-0 w-[500px] xl:w-[500px]"
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
