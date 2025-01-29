"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { slugify, transliterate } from "@/utils/slugify";

export default function Services1() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const currentLang = pathname?.includes("/ka") ? "ge" : "en";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();

        if (data.status === "success") {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getProjectSlug = (project) => {
    const title = currentLang === "ge" ? project.title_ge : project.title_en;
    const transliteratedTitle =
      currentLang === "ge" ? transliterate(title) : title;
    return slugify(transliteratedTitle);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-lg">
          {currentLang === "ge"
            ? "პროექტები ვერ მოიძებნა"
            : "No projects found"}
        </p>
      </div>
    );
  }

  return (
    <section className="section pt-60">
      <div className="container-sub">
        <div className="row">
          {projects.slice(0, 10).map((project) => (
            <div
              key={project.id}
              className="col-lg-4 col-sm-6 mb-30 cursor-pointer"
            >
              <div className="cardService wow fadeInUp">
                <div className="cardInfo">
                  <h3 className="cardTitle text-20-medium color-white mb-10">
                    {currentLang === "ge" ? project.title_ge : project.title_en}
                  </h3>
                  <div className="box-inner-info">
                    <p className="cardDesc text-14 color-white mb-30">
                      {currentLang === "ge"
                        ? project.description_ge
                        : project.description_en}
                    </p>
                    <Link
                      className="cardLink btn btn-arrow-up"
                      href={`/projects/${project.id}/${getProjectSlug(
                        project
                      )}`}
                    >
                      <svg
                        className="icon-16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="cardImage">
                  <Image
                    width={570}
                    height={500}
                    style={{ height: "fit-content" }}
                    src={project.main_image_url}
                    alt={
                      currentLang === "ge" ? project.title_ge : project.title_en
                    }
                    priority
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
