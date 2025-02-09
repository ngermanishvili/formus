"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import { useLocale } from "next-intl";
import { slugify, transliterate } from "@/utils/slugify";

export default function Services1() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const locale = useLocale();
  const currentLang = locale === "ka" ? "ge" : "en";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.data)) {
          // Sort projects to ensure Ortachala Hills (ID: 1) appears first
          const sortedProjects = [...data.data].sort((a, b) => {
            if (a.id === 1) return -1;
            if (b.id === 1) return 1;
            return 0;
          });
          setProjects(sortedProjects);
        } else {
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project, e) => {
    e.preventDefault();
    if (project.id === 1) {
      window.location.href = `/${locale}/projects/1/ortachala-hilsi`;
    } else {
      setSelectedImage(project.main_image_url);
    }
  };

  const ImageModal = ({ imageUrl, onClose }) => {
    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
        onClick={handleOverlayClick}
      >
        <div className="relative max-w-4xl w-full">
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          <div className="relative w-full pt-[75%]">
            <Image
              src={imageUrl}
              alt="Project Image"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-lg text-red-500">
          {currentLang === "ge"
            ? "შეცდომა მონაცემების ჩატვირთვისას"
            : "Error loading projects"}
        </p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
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
          {projects.map(
            (project) =>
              project && (
                <div
                  key={project.id || Math.random()}
                  className="col-lg-4 col-sm-6 mb-30"
                >
                  <div
                    className="cardService wow fadeInUp cursor-pointer mt-4"
                    onClick={(e) => handleProjectClick(project, e)}
                  >
                    <div className="cardInfo">
                      <h3 className="cardTitle text-bold color-white ">
                        {currentLang === "ge"
                          ? project.title_ge || project.title || "უსათაურო"
                          : project.title_en || project.title || "Untitled"}
                      </h3>
                      <div className="">
                        <p className="cardDesc text-14 color-white mb-30">
                          {project.id === 1
                            ? currentLang === "ge"
                              ? "სულიკო თორთლაძის ქუჩა"
                              : "Suliko Tortladze Street"
                            : currentLang === "ge"
                            ? project.description_ge ||
                              project.description ||
                              ""
                            : project.description_en ||
                              project.description ||
                              ""}
                        </p>
                        <p className="text-14 color-white mb-15">
                          {currentLang === "ge"
                            ? project.address_ge || project.address || ""
                            : project.address_en || project.address || ""}
                        </p>
                      </div>
                    </div>
                    <div className="cardImage">
                      <Image
                        width={570}
                        height={500}
                        style={{ height: "fit-content" }}
                        src={project.main_image_url || "/placeholder-image.jpg"}
                        alt={
                          currentLang === "ge"
                            ? project.title_ge ||
                              project.title ||
                              "პროექტის სურათი"
                            : project.title_en ||
                              project.title ||
                              "Project image"
                        }
                        priority
                      />
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
}
