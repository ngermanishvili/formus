"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer5 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import { Check } from "lucide-react";

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
      <Header1 />
      <MobailHeader1 />

      <div className="relative w-full bg-gray-50 py-16">
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

            {/* First Section */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                {getLocalizedField(aboutData[0], "title")}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {getLocalizedField(aboutData[0], "description")}
              </p>
            </div>

            {/* Second Section with circular image */}
            <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  {getLocalizedField(aboutData[1], "title")}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {getLocalizedField(aboutData[1], "description")}
                </p>
              </div>
              <div className="w-full md:w-1/3 relative">
                <div className="aspect-square rounded-full overflow-hidden shadow-xl">
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

            {/* Third Section with Services List */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-20">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  {getLocalizedField(aboutData[2], "title")}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
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
                          <span className="text-gray-700">{service}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div className="w-full md:w-1/3 relative">
                <div className="aspect-square rounded-full overflow-hidden shadow-xl">
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
      <Footer5 />
    </>
  );
};

export default AboutFormus;
