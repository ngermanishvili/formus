"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import GreenSectionShape from "@/public/assets/shapes/project/4.png";

// ფუნქცია პარაგრაფების დასარენდერებლად (ახალი ხაზების გათვალისწინებით)
const renderParagraphs = (text) => {
  if (!text) return null;
  return text.split("\n").map((paragraph, index) => (
    <p key={index} className="mb-4 font-firago text-base lg:text-lg">
      {paragraph}
    </p>
  ));
};

const AboutProject = ({ projectId }) => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  const pathname = usePathname();
  const locale = pathname.includes("/ka") ? "ka" : "en";
  const currentLang = locale === "ka" ? "ge" : "en";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // პროექტის შესახებ სექციების ჩატვირთვა
        const response = await fetch(`/api/projects/${projectId}/about`);
        const result = await response.json();

        if (result.status === "success") {
          console.log(`About data for project ${projectId}:`, result.data);
          setSections(result.data);
        } else {
          console.error("Failed to fetch about data:", result);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    // ფოლბეკ კონტენტი, თუ API-დან მონაცემები ვერ მივიღეთ
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {locale === "ka" ? "პროექტის შესახებ" : "About the Project"}
          </h2>
          <p className="text-center text-lg text-gray-500">
            {locale === "ka"
              ? "ინფორმაცია ამ პროექტის შესახებ არ არის ხელმისაწვდომი"
              : "Information about this project is not available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* About Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {locale === "ka" ? "პროექტის შესახებ" : "About the Project"}
          </h2>

          {/* First section */}
          {sections.length > 0 && (
            <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  {currentLang === "ge"
                    ? sections[0].title_ge
                    : sections[0].title_en}
                </h3>
                {/* Show subtitle if exists */}
                {((currentLang === "ge" && sections[0].subtitle_ge) ||
                  (currentLang === "en" && sections[0].subtitle_en)) && (
                  <h4 className="text-lg text-gray-600 mb-6">
                    {currentLang === "ge"
                      ? sections[0].subtitle_ge
                      : sections[0].subtitle_en}
                  </h4>
                )}
                {/* If no subtitle, add margin */}
                {!(
                  (currentLang === "ge" && sections[0].subtitle_ge) ||
                  (currentLang === "en" && sections[0].subtitle_en)
                ) && <div className="mb-6"></div>}
                <div className="space-y-2">
                  {renderParagraphs(
                    currentLang === "ge"
                      ? sections[0].description_ge
                      : sections[0].description_en
                  )}
                </div>
              </div>
              <div className="w-full md:w-[350px] flex justify-center">
                <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={
                      sections[0].image_url ||
                      "/assets/ortachala-project/ortachala-project.png"
                    }
                    alt={
                      currentLang === "ge"
                        ? sections[0].title_ge
                        : sections[0].title_en
                    }
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Second section with right-aligned image */}
          {sections.length > 1 && (
            <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-6">
                  {currentLang === "ge"
                    ? sections[1].title_ge
                    : sections[1].title_en}
                </h3>
                <div className="space-y-2">
                  {renderParagraphs(
                    currentLang === "ge"
                      ? sections[1].description_ge
                      : sections[1].description_en
                  )}
                </div>
              </div>
              <div className="w-full md:w-[350px] flex justify-center">
                <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={
                      sections[1].image_url ||
                      "/assets/ortachala-project/ortachala-2.png"
                    }
                    alt={
                      currentLang === "ge"
                        ? sections[1].title_ge
                        : sections[1].title_en
                    }
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Third section with left-aligned image */}
          {sections.length > 2 && (
            <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-20">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-6">
                  {currentLang === "ge"
                    ? sections[2].title_ge
                    : sections[2].title_en}
                </h3>
                <div className="space-y-4">
                  {renderParagraphs(
                    currentLang === "ge"
                      ? sections[2].description_ge
                      : sections[2].description_en
                  )}
                </div>
              </div>
              <div className="w-full md:w-[350px] flex justify-center">
                <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={
                      sections[2].image_url ||
                      "/assets/ortachala-project/ortachala-3.png"
                    }
                    alt={
                      currentLang === "ge"
                        ? sections[2].title_ge
                        : sections[2].title_en
                    }
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3D Section - Only show for Ortachala Hills (projectId === "1") */}
      {projectId === "1" && (
        <section className="relative flex flex-col items-center justify-center min-h-[500px] bg-[#ABC188] py-16 px-4 overflow-hidden">
          <div className="container mx-auto max-w-4xl text-center mb-12 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              {locale === "ka" ? "მზის ლოკაცია" : "Sun Location"}
            </h2>

            <div className="relative w-full h-[300px] md:h-[500px] mx-auto">
              <Image
                src="https://i.ibb.co/4wnf6qcW/ORTACHALA-HILLS-3.gif"
                alt={locale === "ka" ? "მზის ლოკაცია" : "Sun Location"}
                fill
                unoptimized
                className="object-cover rounded-3xl shadow-xl"
                sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
              />
            </div>
          </div>

          {/* Decorative Shape */}
          <div className="absolute bottom-0 left-0 w-[100px] sm:w-[150px] md:w-[200px] lg:w-[250px] xl:w-[300px] pointer-events-none z-0">
            <Image
              src={GreenSectionShape}
              alt="Decorative Shape"
              className="object-contain"
            />
          </div>
        </section>
      )}
    </>
  );
};

export default AboutProject;
