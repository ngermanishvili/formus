"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { slugify, transliterate } from "@/utils/slugify";

export default function MobileProjects({ projects }) {
  const pathname = usePathname();
  const currentLang = pathname?.includes("/ka") ? "ge" : "en";

  const getProjectSlug = (project) => {
    const title = currentLang === "ge" ? project.title_ge : project.title_en;
    const transliteratedTitle =
      currentLang === "ge" ? transliterate(title) : title;
    return slugify(transliteratedTitle);
  };

  return (
    <div className="grid grid-cols-1 gap-4 px-4 py-6 bg-gradient-to-b from-black/50 to-black/80">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}/${getProjectSlug(project)}`}
          className="block"
        >
          <div className="relative overflow-hidden rounded-lg bg-gray-900 aspect-[4/3] group">
            <div className="absolute inset-0">
              <Image
                src={project.main_image_url}
                alt={currentLang === "ge" ? project.title_ge : project.title_en}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              {/* Default Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 opacity-100 transition-opacity duration-300" />
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-800/50 to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="relative h-full flex flex-col justify-end p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {currentLang === "ge" ? project.title_ge : project.title_en}
              </h3>

              <div className="flex items-center space-x-2 text-white/80 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <span className="font-medium">
                  {currentLang === "ge" ? "პროექტის ნახვა" : "View Project"}
                </span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
