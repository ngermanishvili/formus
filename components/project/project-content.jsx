"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { slugify, transliterate } from "@/utils/slugify";

export default function ProjectContent({ id, slug }) {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const router = useRouter();

  const pathname = usePathname();
  const currentLang = pathname.includes("/ka") ? "ge" : "en";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();

        if (data.status === "success" && data.data) {
          const project = data.data.find((p) => p.id === parseInt(id));

          if (project) {
            const title =
              currentLang === "ge" ? project.title_ge : project.title_en;
            const expectedSlug = slugify(
              currentLang === "ge" ? transliterate(title) : title
            );

            // თუ slug არასწორია, გადავამისამართოთ სწორ მისამართზე
            if (slug !== expectedSlug) {
              router.replace(`/projects/${id}/${expectedSlug}`);
              return;
            }

            setProjectData({
              title: currentLang === "ge" ? project.title_ge : project.title_en,
              description:
                currentLang === "ge"
                  ? project.description_ge
                  : project.description_en,
              features:
                currentLang === "ge"
                  ? project.features_ge
                  : project.features_en,
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

    if (id && slug) {
      fetchData();
    }
  }, [id, slug, currentLang, router]);

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
        <p className="text-center text-lg">პროექტი ვერ მოიძებნა</p>
        <p className="text-center text-sm text-gray-500">
          გთხოვთ, სცადოთ თავიდან
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {projectData.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {projectData.description}
          </p>
          <p className="text-lg text-gray-600">{projectData.location}</p>
        </div>

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
