"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import Image from "next/image";
import NewsShape1 from "@/public/assets/shapes/home/3.png";
import NewsShape2 from "@/public/assets/shapes/news/1.png";
import ReactMarkdown from "react-markdown";
import BreadCumpShape from "@/public/assets/shapes/home/2.png";

const AboutFormus = () => {
  const [aboutData, setAboutData] = useState([]);
  const params = useParams();
  const locale = params.locale || "ka";

  const introText = {
    en: "The investment in our projects is fully dedicated to creating environmentally friendly, safe and comfortable developments.",
    ka: "პროექტებში განხორციელებული ინვესტიცია სრულად მიმართულია ეკოლოგიურად სუფთა, უსაფრთხო  და მყუდრო განაშენიანების შექმნაზე.",
  };

  const benefits = {
    en: [
      "Flexible payment terms",
      "Efficient placement of savings",
      "Energy-efficient real estate with increasing value",
      "Strict adherence to construction timelines",
      "Fully funded projects",
    ],
    ka: [
      "გადახდის ხელსაყრელ პირობებს",
      "დანაზოგის ეფექტურ განთავსებას",
      "ენერგოეფექტურ უძრავ ქონებას მზარდი ღირებულებით",
      "მშენებლობის მკაცრად დაცულ ვადებს",
      "სრულად დაფინანსებულ პროექტებს",
    ],
  };

  const companionText = {
    en: 'For future residents, "Formus" serves as a guide and companion, from the very beginning of choosing a home to opening the door to their own apartment.',
    ka: 'მომავალი მობინადრეებისთვის "ფორმუსი" არის ახალი ცხოვრების გზამკვლევი და თანამგზავრი სახლის შერჩევის დაწყებიდან საკუთარი ბინის კარის შეღებამდე.',
  };

  const companionTitle = {
    en: "The company offers every resident: ",
    ka: "კომპანია ყველა მომხმარებელს სთავაზობს: ",
  };

  const getLocalizedField = (item, field) => {
    if (!item) return "";
    const fieldSuffix = locale === "en" ? "en" : "ge";
    return item[`${field}_${fieldSuffix}`];
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

  const renderBenefits = () => {
    const introText = {
      en: "The investment in our projects is fully dedicated to creating environmentally friendly, safe and comfortable developments.",
      ka: "პროექტებში განხორციელებული ინვესტიცია სრულად მიმართულია ეკოლოგიურად სუფთა, უსაფრთხო  და მყუდრო განაშენიანების შექმნაზე.",
    };

    const benefits = {
      en: [
        "Flexible payment terms",
        "Efficient placement of savings",
        "Energy-efficient real estate with increasing value",
        "Strict adherence to construction timelines",
        "Fully funded projects",
      ],
      ka: [
        "გადახდის ხელსაყრელ პირობებს",
        "დანაზოგის ეფექტურ განთავსებას",
        "ენერგოეფექტურ უძრავ ქონებას მზარდი ღირებულებით",
        "მშენებლობის მკაცრად დაცულ ვადებს",
        "სრულად დაფინანსებულ პროექტებს",
      ],
    };

    const companionText = {
      en: 'For future residents, "Formus" serves as a guide and companion, from the very beginning of choosing a home to opening the door to their own apartment.',
      ka: 'მომავალი მობინადრეებისთვის "ფორმუსი" არის ახალი ცხოვრების გზამკვლევი და თანამგზავრი სახლის შერჩევის დაწყებიდან საკუთარი ბინის კარის შეღებამდე.',
    };

    return (
      <div className="mb-12">
        <p className="text-lg text-gray-700 leading-relaxed font-normal mb-6">
          {introText[locale]}
        </p>
        <p className="text-lg text-gray-700 leading-relaxed font-normal mb-4">
          {companionTitle[locale]}
        </p>
        <ul className="space-y-4 mb-6">
          {benefits[locale].map((benefit, index) => (
            <li key={index} className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-gray-700 font-normal">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        if (data.status === "success") {
          setAboutData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      }
    };
    fetchAboutData();
  }, []);

  const formatTitle = (title) => {
    if (!title) return "";
    if (locale === "en") {
      return title.split(" for ").join("\n for ");
    } else {
      return title.split(" შენებისთვის").join("\nშენებისთვის");
    }
  };

  return (
    <div className="relative w-full bg-gray-50 py-40 font-firago">
      <div className="hidden lg:block  absolute top-[100px] right-0 z-0">
        <img
          src="/assets/shapes/news/1.png"
          alt="Decorative shape"
          className="mt-12  lg:w-[90px] xl:w-[140px]  2xl:w-[200px] min-[1900px]:w-[300px] "
        />
      </div>
      <div className="hidden lg:block absolute bottom-[400px] left-[-20px] z-0">
        <img
          src="/assets/shapes/news/3.png"
          alt="Decorative shape"
          className="mt-12 lg:w-[110px] xl:w-[170px] 2xl:w-[200px] min-[1900px]:w-[300px] "
        />
      </div>
      <div className="container mx-auto px-4">
        <div className="max-w-[970px] mx-auto">
          <div className="w-full mb-16">
            <img
              src={aboutData[0]?.image_url}
              alt="Formus Building Complex"
              className="w-full h-[800px] max-w-[1200px] object-cover object-bottom rounded-2xl shadow-lg"
            />
          </div>

          <div className="mb-20">
            <div className="relative mb-8">
              <div className="absolute left-[-20px] top-[-10px] z-0">
                <Image
                  src={BreadCumpShape}
                  alt="Decorative shape"
                  width={90}
                  height={90}
                  className="w-[90px] h-[90px]"
                />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 font-firago whitespace-pre-line relative z-10">
                {formatTitle(getLocalizedField(aboutData[0], "title"))}
              </h2>
            </div>
            <div className="space-y-4">
              {renderParagraphs(getLocalizedField(aboutData[0], "description"))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 font-firago">
                {getLocalizedField(aboutData[1], "title")}
              </h2>
              <div className="space-y-4">
                {renderParagraphs(
                  getLocalizedField(aboutData[1], "description")
                )}
              </div>
            </div>
            <div className="w-full md:w-[350px] flex justify-center">
              <div className="w-full h-[350px] rounded-lg overflow-hidden shadow-xl">
                <img
                  src={aboutData[1]?.image_url || "ფოტო ვერ მოიძებნა"}
                  alt="Building Quality"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-20">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 font-firago">
                {getLocalizedField(aboutData[2], "title")}
              </h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed font-normal mb-6">
                  {introText[locale]}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed font-normal mb-4">
                  {companionTitle[locale]}
                </p>
                <ul className="space-y-4 mb-6">
                  {benefits[locale].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <span className="text-gray-700 font-normal">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-lg text-gray-700 leading-relaxed font-normal">
                  {companionText[locale]}
                </p>
              </div>
            </div>
            <div className="w-full md:w-[350px] flex justify-center">
              <div className="w-full h-[350px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  width={100}
                  height={350}
                  src="https://res.cloudinary.com/ds9dsumwl/image/upload/v1740007760/formus/avzerdz2slr0g1rftaot.png"
                  alt="Our Services"
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

export default AboutFormus;
