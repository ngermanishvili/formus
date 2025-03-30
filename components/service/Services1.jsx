"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { useLocale } from "next-intl";

export default function Services1() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);

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
          // Use display_order for sorting projects
          const sortedProjects = [...data.data].sort((a, b) => {
            // If both have display_order, sort by it
            if (a.display_order !== null && b.display_order !== null) {
              return a.display_order - b.display_order;
            }
            // If only one has display_order, prioritize the one with display_order
            if (a.display_order !== null) return -1;
            if (b.display_order !== null) return 1;
            // If neither has display_order, sort by created_at (newest first)
            return new Date(b.created_at) - new Date(a.created_at);
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

  const getProjectAddress = (project) => {
    if (project.id === 1) {
      return currentLang === "ge"
        ? "სულიკო თორთლაძის ქუჩა"
        : "Suliko Tortladze Street";
    }
    return currentLang === "ge"
      ? project.description_ge || project.description || ""
      : project.description_en || project.description || "";
  };

  const handleProjectClick = (project, e) => {
    e.preventDefault();
    if (project.is_active) {
      // თუ პროექტი აქტიურია, გადავამისამართოთ დეტალურ გვერდზე
      const slug = (project.title_ge || project.title || "project")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");

      window.location.href = `/${locale}/projects/${project.id}/${slug}`;
    } else {
      // თუ პროექტი არააქტიურია, მხოლოდ გავხსნათ ფოტო
      openModal(project.main_image_url);
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalClosing(true);
    document.body.style.overflow = "unset";
    setTimeout(() => {
      setSelectedImage(null);
      setIsModalClosing(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && selectedImage) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedImage]);

  const ImageModal = ({ imageUrl, onClose }) => {
    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isModalClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleOverlayClick}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-8 h-8" />
        </button>

        <div
          className={`relative w-full max-w-3xl mx-4 aspect-[4/3] transition-transform duration-300 ${
            isModalClosing ? "scale-95" : "scale-100"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={imageUrl}
            alt="Project Image"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
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
                    className="cardService wow fadeInUp cursor-pointer mt-4 group"
                    onClick={(e) => handleProjectClick(project, e)}
                  >
                    <div className="cardInfo">
                      <h3 className="cardTitle text-bold color-white">
                        {currentLang === "ge"
                          ? project.title_ge || project.title || "უსათაურო"
                          : project.title_en || project.title || "Untitled"}
                      </h3>
                      <div className="">
                        <p className="cardDesc text-14 color-white">
                          {getProjectAddress(project)}
                        </p>
                      </div>
                    </div>
                    <div
                      className="cardImage overflow-hidden"
                      style={{ maxHeight: "280px" }}
                    >
                      <Image
                        width={300}
                        height={280}
                        style={{
                          height: "280px",
                          objectFit: "cover",
                        }}
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
                        className="transition-transform duration-500 group-hover:scale-105"
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
        <ImageModal imageUrl={selectedImage} onClose={closeModal} />
      )}
    </section>
  );
}
