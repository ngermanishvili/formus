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

// პარსინგის ფუნქცია გალერეის სურათებისთვის
function parseImages(imageUrl) {
  console.log("Gallery imageUrl in about-project:", imageUrl);

  if (!imageUrl) {
    console.log("No gallery images found");
    return [];
  }

  try {
    // თუ მასივია, დავაბრუნოთ
    if (Array.isArray(imageUrl)) {
      console.log("Image URL is already an array:", imageUrl);
      return imageUrl
        .map((url) => (typeof url === "string" ? url.replace(/['"]/g, "") : ""))
        .filter((url) => url.trim() !== "");
    }

    // გავასუფთაოთ სტრინგი
    let cleanJsonString =
      typeof imageUrl === "string"
        ? imageUrl.replace(/^["'](.*)["']$/, "$1").trim()
        : "";

    console.log("Cleaned gallery JSON string:", cleanJsonString);

    if (!cleanJsonString) {
      console.log("Empty gallery string after cleaning");
      return [];
    }

    // JSON მასივის პარსინგი
    if (cleanJsonString.startsWith("[") && cleanJsonString.endsWith("]")) {
      console.log("String appears to be a JSON array, attempting to parse");
      try {
        const parsed = JSON.parse(cleanJsonString);
        console.log("Successfully parsed gallery JSON:", parsed);

        if (Array.isArray(parsed)) {
          const validUrls = parsed
            .map((url) =>
              typeof url === "string" ? url.replace(/['"]/g, "") : ""
            )
            .filter((url) => url.trim() !== "");

          console.log("Validated gallery URLs:", validUrls);
          return validUrls;
        } else {
          console.log("Parsed gallery result is not an array:", parsed);
        }
      } catch (parseError) {
        console.error("Gallery JSON parsing error:", parseError);
      }
    }

    // URL-ების ამოღება რეგულარული გამოსახულებით
    if (cleanJsonString.includes("http")) {
      console.log("String contains URLs, extracting with regex");
      const urlRegex = /(https?:\/\/[^"'\s,\[\]]+)/g;
      const matches = cleanJsonString.match(urlRegex);

      if (matches && matches.length > 0) {
        console.log("Found gallery URLs with regex:", matches);
        return matches
          .map((url) => url.replace(/['"]/g, ""))
          .filter((url) => url.trim() !== "");
      }
    }

    // ერთი URL-ის შემთხვევა
    if (cleanJsonString.startsWith("http")) {
      console.log("Gallery string appears to be a single URL");
      return [cleanJsonString.replace(/['"]/g, "")];
    }

    console.log("Could not parse gallery images");
    return [];
  } catch (error) {
    console.error("Error parsing gallery images:", error);
    return [];
  }
}

const AboutProject = ({ projectId }) => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);

  const pathname = usePathname();
  const locale = pathname.includes("/ka") ? "ka" : "en";
  const currentLang = locale === "ka" ? "ge" : "en";

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching project data for ID: ${projectId}`);
        setLoading(true);

        // კეშის გამორთვისთვის პარამეტრების დამატება
        const timestamp = new Date().getTime();
        const response = await fetch(
          `/api/projects/${projectId}/about?_=${timestamp}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch project data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched project data:", data);
        setProjectData(data);
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!projectData || !projectData.data || projectData.data.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <p>No project sections available.</p>
      </div>
    );
  }

  const aboutSections = projectData.data;

  const gallerySection = projectData.data.find(
    (section) =>
      section.section_type === "gallery" ||
      (section.title && section.title.toLowerCase().includes("gallery")) ||
      (section.title_geo && section.title_geo.toLowerCase().includes("გალერე"))
  );

  console.log("Gallery section found:", gallerySection);

  const galleryImages = gallerySection
    ? parseImages(gallerySection.image_url)
    : [];

  console.log("Parsed gallery images:", galleryImages);

  return (
    <>
      {/* About Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {locale === "ka" ? "პროექტის შესახებ" : "About the Project"}
          </h2>

          {/* Display the about_page section if it exists */}
          {aboutSections.filter(
            (section) => section.section_type === "about_page"
          ).length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
              <div className="flex-1">
                {aboutSections.map(
                  (section, index) =>
                    section.section_type === "about_page" && (
                      <div key={index}>
                        <h3 className="text-2xl font-bold mb-2">
                          {currentLang === "ge"
                            ? section.title_ge
                            : section.title_en}
                        </h3>
                        {/* Show subtitle if exists */}
                        {((currentLang === "ge" && section.subtitle_ge) ||
                          (currentLang === "en" && section.subtitle_en)) && (
                          <h4 className="text-lg text-gray-600 mb-6">
                            {currentLang === "ge"
                              ? section.subtitle_ge
                              : section.subtitle_en}
                          </h4>
                        )}
                        {/* If no subtitle, add margin */}
                        {!(
                          (currentLang === "ge" && section.subtitle_ge) ||
                          (currentLang === "en" && section.subtitle_en)
                        ) && <div className="mb-6"></div>}
                        <div className="space-y-2">
                          {renderParagraphs(
                            currentLang === "ge"
                              ? section.description_ge
                              : section.description_en
                          )}
                        </div>
                      </div>
                    )
                )}
              </div>
              <div className="w-full md:w-[350px] flex justify-center">
                <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-xl">
                  {aboutSections.find(
                    (section) => section.section_type === "about_page"
                  )?.image_url ? (
                    <img
                      src={
                        aboutSections.find(
                          (section) => section.section_type === "about_page"
                        ).image_url
                      }
                      alt={
                        currentLang === "ge"
                          ? aboutSections.find(
                              (section) => section.section_type === "about_page"
                            ).title_ge
                          : aboutSections.find(
                              (section) => section.section_type === "about_page"
                            ).title_en
                      }
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src="/assets/ortachala-project/ortachala-project.png"
                      alt={
                        locale === "ka" ? "პროექტის სურათი" : "Project image"
                      }
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 px-4 text-center">
              <p>
                {locale === "ka"
                  ? "ამ პროექტისთვის არ არის ხელმისაწვდომი აღწერილობითი სექციები."
                  : "No description sections available for this project."}
              </p>
            </div>
          )}

          {/* Second section with right-aligned image */}
          {aboutSections.length > 1 && (
            <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-6">
                  {currentLang === "ge"
                    ? aboutSections[1].title_ge
                    : aboutSections[1].title_en}
                </h3>
                <div className="space-y-2">
                  {renderParagraphs(
                    currentLang === "ge"
                      ? aboutSections[1].description_ge
                      : aboutSections[1].description_en
                  )}
                </div>
              </div>
              <div className="w-full md:w-[350px] flex justify-center">
                <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={
                      aboutSections[1].image_url ||
                      "/assets/ortachala-project/ortachala-2.png"
                    }
                    alt={
                      currentLang === "ge"
                        ? aboutSections[1].title_ge
                        : aboutSections[1].title_en
                    }
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Third section with left-aligned image */}
          {aboutSections.length > 2 && (
            <div className="flex flex-col md:flex-row-reverse items-center gap-16 mb-20">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-6">
                  {currentLang === "ge"
                    ? aboutSections[2].title_ge
                    : aboutSections[2].title_en}
                </h3>
                <div className="space-y-4">
                  {renderParagraphs(
                    currentLang === "ge"
                      ? aboutSections[2].description_ge
                      : aboutSections[2].description_en
                  )}
                </div>
              </div>
              <div className="w-full md:w-[350px] flex justify-center">
                <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={
                      aboutSections[2].image_url ||
                      "/assets/ortachala-project/ortachala-3.png"
                    }
                    alt={
                      currentLang === "ge"
                        ? aboutSections[2].title_ge
                        : aboutSections[2].title_en
                    }
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <div className="py-16 md:py-24 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
              {gallerySection?.title_geo || gallerySection?.title || "გალერეა"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative h-64 md:h-80 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {gallerySection?.description_geo || gallerySection?.description ? (
              <div className="mt-10 text-center">
                <p className="max-w-3xl mx-auto">
                  {gallerySection.description_geo || gallerySection.description}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}

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
