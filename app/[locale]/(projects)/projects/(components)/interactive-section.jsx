"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import SecondShape1 from "@/public/assets/shapes/project/3.png";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const InteractiveSection = ({ projectData, projectId }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const locale = params.locale || "ka";
  const id = projectId || params?.projectId || "1"; // გამოვიყენოთ პროპი თუ გადმოეცემა, თუ არა params-იდან ან 1 ნაგულისხმევად

  const translations = {
    services: {
      en: "Services",
      ka: "სერვისები",
    },
    prev: {
      en: "Previous",
      ka: "წინა",
    },
    next: {
      en: "Next",
      ka: "შემდეგი",
    },
  };

  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${id}/info`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.data)) {
          // მხოლოდ feature ტიპის ჩანაწერები დავაფილტროთ
          const featureData = data.data.filter(
            (item) => item.section_type === "feature"
          );
          setSections(featureData);
        } else {
          setError("მონაცემების არასწორი ფორმატი");
        }
      } catch (err) {
        console.error("Error fetching project info:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectInfo();
  }, [id]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? sections.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % sections.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (error || sections.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="font-firago text-center text-lg">
          {locale === "ka"
            ? "პროექტის ინფორმაცია ვერ მოიძებნა"
            : "Project information not found"}
        </p>
      </div>
    );
  }

  const activeSection = sections[activeIndex];
  const title =
    locale === "ka" ? activeSection.title_ge : activeSection.title_en;
  const description =
    locale === "ka"
      ? activeSection.description_ge
      : activeSection.description_en;

  return (
    <section className="relative bg-background">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 relative h-screen lg:h-[500px] group overflow-hidden">
          <Image
            src={activeSection.image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="w-full lg:w-1/2 relative">
          <div className="px-6 lg:px-12 xl:px-16 py-12 lg:py-16 h-full flex flex-col">
            <div className="flex-1">
              <div className="max-w-xl">
                <h2 className="font-firago font-bold text-3xl lg:text-3xl text-foreground mb-6 lg:mb-8 leading-tight">
                  {title}
                </h2>
                <p className="font-firago lg:text-lg font-light">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
                <span className="hidden sm:inline">
                  {translations.prev[locale]}
                </span>
              </button>
              <div className="flex gap-2">
                {sections.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      activeIndex === index ? "bg-primary w-4" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              >
                <span className="hidden sm:inline">
                  {translations.next[locale]}
                </span>
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div
            className="hidden lg:block absolute bottom-[-12px] right-0 w-[400px] xl:w-[400px]"
            style={{ zIndex: 10, pointerEvents: "none" }}
          >
            {/* <Image src={SecondShape1} alt="Shape" className="object-contain" /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;
