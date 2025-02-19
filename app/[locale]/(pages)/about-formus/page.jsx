"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import Image from "next/image";
import NewsShape1 from "@/public/assets/shapes/home/3.png";
import NewsShape2 from "@/public/assets/shapes/news/1.png";
import ReactMarkdown from "react-markdown";
import BreadCumpShape from "@/public/assets/shapes/home/2.png";
import Header3 from "@/components/headers/Header3";

const AboutFormus = () => {
  const [aboutData, setAboutData] = useState([]);
  const params = useParams();
  const locale = params.locale || "ka";

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
    <>
      <Header3 />
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
                {renderParagraphs(
                  getLocalizedField(aboutData[0], "description")
                )}
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
                    src={
                      aboutData[1]?.image_url ||
                      "/assets/imgs/page/homepage5/banner.png"
                    }
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
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          className="text-lg text-gray-700 leading-relaxed font-normal mb-6"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-bold text-xl" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="flex items-center gap-4 mb-4">
                          <div className="flex-shrink-0">
                            <Check className="h-6 w-6 text-green-500" />
                          </div>
                          <span className="text-gray-700 font-normal">
                            {props.children}
                          </span>
                        </li>
                      ),
                    }}
                  >
                    {getLocalizedField(aboutData[2], "description")}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="w-full md:w-[350px] flex justify-center">
                <div className="w-full h-[350px] rounded-lg overflow-hidden shadow-xl">
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
