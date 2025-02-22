"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import Image from "next/image";

const AboutOrtachala = () => {
  const params = useParams();
  const locale = params.locale || "ka";

  const content = {
    en: {
      title: "Ortachala Hills",
      subtitle: "Financed by TBC Bank",
      sections: [
        {
          text: '"Ortachala Hills" is located in one of the most peaceful and green areas, close to the cultural center of the old city. The complex is distinguished by its high construction standards and innovative concept, designed to meet every need and desire of its residents.',
        },
        {
          text: "The construction spans 10,000 square meters and includes four residential blocks (15-story and 8-story buildings) and a commercial facility. Due to the project's scale, construction is being carried out in several phases. The construction of the 15-story residential block is nearly complete and commercial spaces are being opened. The 8-story residential block is scheduled for completion in the fall of 2025.",
        },
        {
          text: "The project is particularly appealing due to its recreational space, which covers 3,000 square meters and includes various entertainment and relaxation areas. The residential complex is fully adapted for individuals with disabilities.\n\nThe investment in this project is entirely dedicated to creating an environmentally friendly, safe and tranquil development where vehicles are restricted from entering.",
        },
      ],
    },
    ka: {
      title: "ორთაჭალა ჰილსი",
      subtitle: 'დაფინანსებულია "თიბისი" ბანკის მიერ',
      sections: [
        {
          text: '"ორთაჭალა ჰილსი" ყველაზე მშვიდ და გამწვანებულ ლოკაციაზე, ძველი ქალაქის კულტურულ ცენტრთან ახლოს მდებარეობს. კომპლექსი მაღალი სამშენებლო სტანდარტებითა და კონცეფციით გამოირჩევა, სადაც მომხმარებლის ყველა სურვილი და საჭიროებაა გათვალისწინებული.',
        },
        {
          text: "მშენებლობა მიმდინარეობს 10 000 კვადრატულ მეტრზე, რომელიც მოიცავს 4 საცხოვრებელ ბლოკს (15 და 8 სართულიან შენობებს) და კომერციულ შენობა-ნაგებობას. მასშტაბიდან გამომდინარე მშენებლობა ხორციელდება რამოდენიმე ეტაპად. 15 სართულიანი საცხოვრებელი ბლოკის მშენებლობა თითქმის დასრულებულია და კომერციული ობიექტები იხსნება. 8 სართულიანი საცხოვრებელი ბლოკის მშენებლობა დასრულდება 2025 წლის შემოდგომაზე.",
        },
        {
          text: "პროექტი განსაკუთრებით მომხიბვლელია რეკრეაციული სივრცით, რომელიც 3 000 კვადრატული მეტრის ფართობზეა გაშლილი და სხვადასხვა გასართობ, თუ მოსასვენებელ კუთხეს მოიცავს. საცხოვრებელი კომპლექსი მთლიანად ადაპტირებულია შ.შ.მ. პირებზე.\n\nპროექტში განხორციელებული ინვესტიცია, სრულად მიმართულია ეკოლოგიურად სუფთა, უსაფრთხო და მყუდრო განაშენიანების შექმნაზე, სადაც ავტომობილები ვერ ხვდებიან.",
        },
      ],
    },
  };

  const renderParagraphs = (text) => {
    if (!text) return null;
    return text.split("\n\n").map((paragraph, index) => (
      <p
        key={index}
        className="text-lg text-gray-700 leading-relaxed font-normal mb-6"
      >
        {paragraph.trim()}
      </p>
    ));
  };

  return (
    <div className="relative w-full bg-gray-50 py-40 font-firago">
      <div className="hidden lg:block absolute top-[100px] right-0 z-0">
        <img
          src="/assets/shapes/news/1.png"
          alt="Decorative shape"
          className="mt-12 lg:w-[90px] xl:w-[140px] 2xl:w-[200px] min-[1900px]:w-[300px]"
        />
      </div>
      <div className="hidden lg:block absolute bottom-[400px] left-[-20px] z-0">
        <img
          src="/assets/shapes/news/3.png"
          alt="Decorative shape"
          className="mt-12 lg:w-[110px] xl:w-[170px] 2xl:w-[200px] min-[1900px]:w-[300px]"
        />
      </div>
      <div className="container mx-auto px-4">
        <div className="max-w-[970px] mx-auto">
          {/* Main top image */}
          <div className="w-full mb-16">
            <img
              src="/assets/ortachala-project/ortachala-1.png"
              alt="Ortachala Hills Complex"
              className="w-full h-[800px] max-w-[1200px] object-cover object-bottom rounded-2xl shadow-lg"
            />
          </div>

          {/* Title and first section */}
          <div className="mb-20">
            <div className="relative mb-8">
              <div className="absolute left-[-20px] top-[-10px] z-0">
                <div className="w-[90px] h-[90px]" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 font-firago whitespace-pre-line relative z-10">
                {content[locale].title}
              </h2>
              <h3 className="text-2xl text-gray-700 mt-4 font-firago">
                {content[locale].subtitle}
              </h3>
            </div>
            <div className="space-y-4">
              {renderParagraphs(content[locale].sections[0].text)}
            </div>
          </div>

          {/* Second section with right-aligned image */}
          <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
            <div className="flex-1">
              <div className="space-y-2">
                {renderParagraphs(content[locale].sections[1].text)}
              </div>
            </div>
            <div className="w-full md:w-[350px] flex justify-center">
              <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/assets/ortachala-project/ortachala-2.png"
                  alt="Ortachala Hills Features"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Third section with left-aligned image */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-20">
            <div className="flex-1">
              <div className="space-y-4">
                {renderParagraphs(content[locale].sections[2].text)}
              </div>
            </div>
            <div className="w-full md:w-[350px] flex justify-center">
              <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/assets/ortachala-project/ortachala-3.png"
                  alt="Ortachala Hills Views"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOrtachala;
