"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProjectContent({ id }) {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);

  const pathname = usePathname();
  const currentLang = pathname.includes("/ka") ? "ge" : "en";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();

        if (data.status === "success" && data.data) {
          const project = data.data;

          // Parse features if they're stored as strings
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
              currentLang === "ge" ? project.location_ge : project.location_en,
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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-lg">
          {currentLang === "ge" ? "პროექტი ვერ მოიძებნა" : "Project not found"}
        </p>
        <p className="text-center text-sm text-gray-500">
          {currentLang === "ge" ? "პროექტის ID: " + id : "Project ID: " + id}
        </p>
      </div>
    );
  }

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
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {projectData.title}
            </h1>
            <p className="text-xl text-white">{projectData.location}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">
              {currentLang === "ge" ? "პროექტის შესახებ" : "About the Project"}
            </h2>
            <p className="text-lg text-gray-600">{projectData.description}</p>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">
              {currentLang === "ge" ? "მახასიათებლები" : "Features"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectData.features?.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <Image
                      src={projectData.main_image_url}
                      alt={feature.title}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Second Section */}
      <section className="relative bg-white">
        <div className="flex flex-col lg:flex-row items-stretch">
          <div className="w-full lg:w-1/2 relative h-[400px] group overflow-hidden">
            <Image
              src={
                projectData.second_section_img ||
                "/assets/imgs/page/homepage5/banner.png"
              }
              alt={projectData.second_section_title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="w-full lg:w-1/2 px-8 lg:px-16 py-16 flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-black mb-8 leading-tight">
              {projectData.second_section_title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {projectData.second_section_description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
