"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer5 from "@/components/footers/Footer1";
import { Check } from "lucide-react";
import Header5 from "@/components/headers/Header5";
import Image from "next/image";
import NewsShape1 from "@/public/assets/shapes/home/3.png";
import NewsShape2 from "@/public/assets/shapes/news/1.png";

const AboutFormus = () => {
  const [aboutData, setAboutData] = useState([]);
  const params = useParams();
  const locale = params.locale || "ka";

  const services = {
    ge: [
      "გადახდის ხელსაყრელი პირობები",
      "დანაზოგის ეფექტური განთავსება",
      "ენერგოეფექტური უძრავი ქონება მზარდი ღირებულებით",
      "მშენებლობის მკაცრად დაცული ვადები",
      "სრულად დაფინანსებული პროექტები",
    ],
    en: [
      "Flexible payment terms",
      "Effective placement of savings",
      "Energy-efficient real estate with increasing value",
      "Strict adherence to construction timelines",
      "Fully funded projects",
    ],
  };

  const getLocalizedField = (item, field) => {
    if (!item) return "";
    const fieldSuffix = locale === "en" ? "en" : "ge";
    return item[`${field}_${fieldSuffix}`];
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

  return (
    <>
      <div className="relative w-full bg-gray-50 py-40 font-firago">
        <div className="absolute bottom-[-200px] sm:bottom-[-80px] md:bottom-[-80px] lg:top-[100px] right-0 z-0">
          <Image
            src={NewsShape2}
            alt="Decorative shape"
            width={200}
            height={200}
            className="mt-12"
          />
        </div>
        <div className="absolute bottom-[-200px] sm:bottom-[-80px] md:bottom-[-80px] lg:bottom-[600px] left-[-20px] right-0 z-0">
          <Image
            src={NewsShape1}
            alt="Decorative shape"
            width={200}
            height={200}
            className="mt-12"
          />
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="w-full mb-16">
              <img
                src={
                  aboutData[0]?.image_url ||
                  "/assets/imgs/page/homepage5/banner.png"
                }
                alt="Formus Building Complex"
                className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
              />
            </div>

            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 font-firago">
                {getLocalizedField(aboutData[0], "title")}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed font-normal">
                {getLocalizedField(aboutData[0], "description")}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 font-firago">
                  {getLocalizedField(aboutData[1], "title")}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed font-normal">
                  {getLocalizedField(aboutData[1], "description")}
                </p>
              </div>
              <div className="w-full md:w-1/3 relative">
                <div className="aspect-square rounded-md overflow-hidden shadow-xl">
                  <img
                    src={
                      aboutData[1]?.image_url ||
                      "/assets/imgs/page/homepage5/banner.png"
                    }
                    alt="Building Quality"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-lg">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-20">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 font-firago">
                  {getLocalizedField(aboutData[2], "title")}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8 font-normal">
                  {getLocalizedField(aboutData[2], "description")}
                </p>
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <ul className="space-y-4">
                    {services[locale === "en" ? "en" : "ge"].map(
                      (service, index) => (
                        <li key={index} className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <Check className="h-6 w-6 text-green-500" />
                          </div>
                          <span className="text-gray-700 font-normal">
                            {service}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div className="w-full md:w-1/3 relative">
                <div className="aspect-square rounded-md overflow-hidden shadow-xl">
                  <img
                    src={
                      aboutData[2]?.image_url ||
                      "/assets/imgs/page/homepage5/banner.png"
                    }
                    alt="Our Services"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutFormus;
