"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import SecondShape1 from "@/public/assets/shapes/project/3.png";
import SecondShape2 from "@/public/assets/shapes/project/1.png";
import InteractiveSection from "./interactive-section";
import BreadCumpShape from "@/public/assets/shapes/home/2.png";

const ProjectContent = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);

  const pathname = usePathname();
  const currentLang = pathname.includes("/ka") ? "ge" : "en";

  // გუგლის რუკების iframe-ების ობიექტი ID-ების მიხედვით
  const mapsUrls = {
    4: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47668.398555901!2d44.776175740117694!3d41.6930006855846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x404473293bf38e47%3A0x2a01498ef89336b1!2z4YOS4YOa4YOT4YOQ4YOc4YOY!5e0!3m2!1sen!2sge!4v1738152340364!5m2!1sen!2sge",
    5: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47668.398555901!2d44.776175740117694!3d41.6930006855846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x404473293bf38e47%3A0x2a01498ef89336b1!2z4YOS4YOa4YOT4YOQ4YOc4YOY!5e0!3m2!1sen!2sge!4v1738152340364!5m2!1sen!2sge",
    6: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2973.608691176251!2d44.80494089310907!3d41.81518939711609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40446ea74c02bddd%3A0x309e548b50469e4!2s9%20Demetre%20Tavdadebuli%20St%2C%20T%27bilisi!5e0!3m2!1sen!2sge!4v1738152226916!5m2!1sen!2sge",
    7: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2977.1701674313676!2d44.77727192707962!3d41.73842232125736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4044729497628cab%3A0xf7bd7212e7185ed4!2sKonstantine%20Stanislavski%20Street!5e0!3m2!1sen!2sge!4v1738152196028!5m2!1sen!2sge",
    8: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.8035851667946!2d44.77017057707863!3d41.70317567126157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cc9426da181%3A0x8de9375d20f7ab2!2s9%20Giorgi%20Shatberashvili%20St%2C%20T%27bilisi%200179!5e0!3m2!1sen!2sge!4v1738152105782!5m2!1sen!2sge",
    9: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2976.6596198049974!2d44.674290477080206!3d41.749434171256226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40447100739a0edd%3A0x691dd1a5da4fa9f2!2sLisi%20City%20View!5e0!3m2!1sen!2sge!4v1738152037870!5m2!1sen!2sge",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();

        if (data.status === "success" && data.data) {
          const project = data.data;

          if (id === "1") {
            const features =
              currentLang === "ge"
                ? typeof project.features_ge === "string"
                  ? JSON.parse(project.features_ge)
                  : project.features_ge
                : typeof project.features_en === "string"
                ? JSON.parse(project.features_en)
                : project.features_en;

            setProjectData({
              title: currentLang === "ge" ? project.title_ge : project.title_en,
              description:
                currentLang === "ge"
                  ? project.description_ge
                  : project.description_en,
              features: features || [],
              main_image_url: project.main_image_url,
              location:
                currentLang === "ge"
                  ? project.location_ge
                  : project.location_en,
              second_section_img: project.second_section_img,
              second_section_title:
                currentLang === "ge"
                  ? project.second_section_title_ge
                  : project.second_section_title_en,
              second_section_description:
                currentLang === "ge"
                  ? project.second_section_description_ge
                  : project.second_section_description_en,
            });
          } else {
            setProjectData({
              title: currentLang === "ge" ? project.title_ge : project.title_en,
              main_image_url: project.main_image_url,
              location:
                currentLang === "ge"
                  ? project.location_ge
                  : project.location_en,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, currentLang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="font-firago text-center text-lg">
          {currentLang === "ge" ? "პროექტი ვერ მოიძებნა" : "Project not found"}
        </p>
        <p className="font-firago text-center text-sm text-muted-foreground">
          {currentLang === "ge" ? "პროექტის ID: " + id : "Project ID: " + id}
        </p>
      </div>
    );
  }

  if (id === "1") {
    return (
      <>
        {/* Hero Section */}
        <div className="relative h-[70vh] w-full">
          <Image
            src={projectData.main_image_url}
            alt={projectData.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 z-10">
            <Image
              src={SecondShape2}
              alt="Bottom shape"
              width={300}
              height={300}
              className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] object-contain"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="font-firago font-bold text-4xl md:text-6xl text-white mb-4">
                {projectData.title}
              </h1>
              <p className="font-firago text-xl text-white">
                {projectData.location}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className=" mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-[100px] justify-end">
            <div className="lg:w-[600px] relative">
              {/* Content container */}
              <div className="relative z-20 ">
                <p className="font-firago text-sm text-foreground mb-2">
                  {currentLang === "ge" ? "ჩვენ შესახებ" : "About Us"}
                </p>
                <h2 className="font-firago font-bold text-3xl text-foreground mb-4">
                  {currentLang === "ge" ? (
                    <>
                      ორთაჭალა ჰილსი
                      <br />
                      დაფინანსებულია თი-ბი-სი ბანკის მიერ.
                    </>
                  ) : (
                    <>
                      Ortachala Hills
                      <br />
                      Financed by TBC Bank.
                    </>
                  )}
                </h2>
                <p className="font-firago text-lg font-light">
                  {projectData.description}
                </p>
              </div>

              {/* Decorative shape - positioned below content */}
              <div className="absolute left-[-14px] bottom-[230px] z-10">
                <Image
                  src={BreadCumpShape}
                  alt="Decorative shape"
                  width={90}
                  height={90}
                  className="w-[90px] h-[90px]"
                />
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="relative h-52 lg:h-80 xl:h-96 2xl:h-[17rem] group overflow-hidden rounded-lg"
                  >
                    <Image
                      src={
                        projectData.second_section_img ||
                        "/assets/imgs/page/homepage5/banner.png"
                      }
                      alt={`Gallery image ${index}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Second Section */}
        <section className="relative bg-background">
          <InteractiveSection projectData={projectData} />
        </section>
      </>
    );
  }

  // დანარჩენი ID-ებისთვის hero სექცია და რუკა
  return (
    <>
      <div className="relative h-[100vh] w-full">
        <Image
          src={projectData.main_image_url}
          alt={projectData.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="font-firago font-bold text-4xl md:text-6xl text-white mb-4">
              {projectData.title}
            </h1>
            <p className="font-firago text-xl text-white">
              {projectData.location}
            </p>
          </div>
        </div>
      </div>
      {mapsUrls[id] && (
        <div className="w-full h-[600px] mt-8">
          <iframe
            src={mapsUrls[id]}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </>
  );
};

export default ProjectContent;
