"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer5 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import MobailHeader1 from "@/components/headers/MobailHeader1";

const AboutFormus = () => {
  const [aboutData, setAboutData] = useState([]);
  const params = useParams();
  const locale = params.locale || "ka"; // თუ locale არაა, default არის 'ka'

  // ენის მიხედვით ველების შერჩევის ფუნქცია
  const getLocalizedField = (item, field) => {
    if (!item) return "";

    // მაგ: title_ge -> title_en
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
      <Header1 /> <MobailHeader1 />
      <div className="flex flex-col items-center w-full py-10">
        {/* Hero Image Container */}
        <div className="w-full flex justify-center mb-8 px-4">
          <div className="w-full max-w-[1100px]">
            <img
              src={
                aboutData[0]?.image_url ||
                "/assets/imgs/page/homepage5/banner.png"
              }
              alt="Formus Building Complex"
              className="w-full max-h-[800px] object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full max-w-6xl px-4">
          <h2 className="text-4xl font-bold mb-6">
            {getLocalizedField(aboutData[0], "title")}
          </h2>

          {/* First Section */}
          <div className="mb-12">
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              {getLocalizedField(aboutData[0], "description")}
            </p>
          </div>

          {/* Middle Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="flex-1">
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                {getLocalizedField(aboutData[1], "description")}
              </p>
            </div>
            <div className="relative">
              <div className="w-72 h-72 rounded-full overflow-hidden">
                <img
                  src={
                    aboutData[1]?.image_url ||
                    "/assets/imgs/page/homepage5/banner.png"
                  }
                  alt="Building Detail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 right-0 bg-white p-2 rounded-full shadow-lg">
                <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-72 h-72 rounded-full overflow-hidden">
              <img
                src={
                  aboutData[2]?.image_url ||
                  "/assets/imgs/page/homepage5/banner.png"
                }
                alt="Building Detail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                {getLocalizedField(aboutData[2], "description")}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          {aboutData[0]?.address_ge && (
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">
                {locale === "en"
                  ? "Contact Information"
                  : "საკონტაქტო ინფორმაცია"}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">
                    {locale === "en" ? "Address:" : "მისამართი:"}
                  </span>
                  {getLocalizedField(aboutData[0], "address")}
                </p>
                {aboutData[0].phone && (
                  <p className="text-gray-700">
                    <span className="font-semibold">
                      {locale === "en" ? "Phone:" : "ტელეფონი:"}
                    </span>
                    {aboutData[0].phone}
                  </p>
                )}
                {aboutData[0].email && (
                  <p className="text-gray-700">
                    <span className="font-semibold">
                      {locale === "en" ? "Email:" : "ელ-ფოსტა:"}
                    </span>
                    {aboutData[0].email}
                  </p>
                )}
              </div>
              {aboutData[0].map_url && (
                <div className="mt-4 h-[300px] rounded-lg overflow-hidden">
                  <iframe
                    src={aboutData[0].map_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer5 />
    </>
  );
};

export default AboutFormus;
