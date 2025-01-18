"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function HeroSectionContent() {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);

  const pathname = usePathname();
  const currentLang = pathname.includes("/ka") ? "ge" : "en";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();

        if (data.status === "success" && data.data && data.data.length > 0) {
          const ortachalaProject = data.data.find(
            (project) =>
              project.title_en?.toLowerCase().includes("ortachala hills") ||
              project.title_ge?.toLowerCase().includes("ორთაჭალა ჰილს")
          );

          if (ortachalaProject) {
            // აღარ ვიყენებთ JSON.parse-ს, რადგან მონაცემები უკვე JavaScript ობიექტებია
            setProjectData({
              title:
                currentLang === "ge"
                  ? ortachalaProject.title_ge
                  : ortachalaProject.title_en,
              description:
                currentLang === "ge"
                  ? ortachalaProject.description_ge
                  : ortachalaProject.description_en,
              features:
                currentLang === "ge"
                  ? ortachalaProject.features_ge
                  : ortachalaProject.features_en,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLang]);

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
          {currentLang === "ge"
            ? "გთხოვთ, შეამოწმოთ პროექტის სახელი"
            : "Please check the project name"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Content */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {projectData.title}
          </h1>
          <p className="text-lg text-gray-600">{projectData.description}</p>
        </div>

        {/* Right Grid */}
        <div className="lg:w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.isArray(projectData.features) &&
              projectData.features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <Image
                      src="/icon-placeholder.png"
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
  );
}
