"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import Image from "next/image";

const AboutOrtachala = () => {
  const params = useParams();
  const locale = params.locale || "ka";
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // ვიყენებთ სპეციალურ about API-ს, რომელიც აბრუნებს მხოლოდ about_page ტიპის ჩანაწერებს
        const response = await fetch(`/api/projects/1/about`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const result = await response.json();

        if (result.status === "success") {
          console.log("About Ortachala data:", result.data);
          setAboutData(result.data);
        } else {
          console.error("Failed to fetch about data:", result);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Fallback content in case API fails
  const fallbackContent = {
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
      subtitle: "",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Use data from API or fallback to hardcoded content
  const sections = aboutData || [];

  // Log data for debugging
  console.log("About data from API:", sections);

  if (sections.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {locale === "ka" ? "მონაცემები ვერ მოიძებნა" : "No data found"}
          </h2>
          <p className="mt-2">
            {locale === "ka"
              ? "გთხოვთ დაამატოთ სექციები ადმინ პანელიდან (section_type: about_page)"
              : "Please add sections from admin panel (section_type: about_page)"}
          </p>
        </div>
      </div>
    );
  }

  const title =
    sections.length > 0
      ? locale === "ka"
        ? sections[0].title_ge
        : sections[0].title_en
      : "";
  const subtitle = "";

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

          {/* Title and first section */}
          <div className="mb-20">
            <div className="relative mb-8">
              <div className="absolute left-[-20px] top-[-10px] z-0">
                <div className="w-[90px] h-[90px]" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 font-firago whitespace-pre-line relative z-10">
                {title}
              </h2>
              <h3 className="text-2xl text-gray-700 mt-4 font-firago">
                {subtitle}
              </h3>
            </div>
            {sections.length > 0 && (
              <div className="mt-6">
                {renderParagraphs(
                  locale === "ka"
                    ? sections[0].description_ge
                    : sections[0].description_en
                )}
              </div>
            )}
          </div>

          {/* Second section with right-aligned image */}
          {sections.length > 1 && (
            <div className="flex flex-col md:flex-row items-center gap-16 mb-20">
              <div className="flex-1">
                <div className="space-y-2">
                  {renderParagraphs(
                    locale === "ka"
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
                      locale === "ka"
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
                <div className="space-y-4">
                  {renderParagraphs(
                    locale === "ka"
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
                      locale === "ka"
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
    </div>
  );
};

export default AboutOrtachala;
