"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function ProjectHero({ id }) {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();

        if (data.status === "success" && data.data) {
          setProjectData({
            title: data.data.title_ge,
            mainImage: data.data.main_image_url,
            location: data.data.location_ge,
          });
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!projectData) return null;

  return (
    <div className="hero-section relative h-[80vh] min-h-[600px] w-full">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <Image
          src={projectData.mainImage}
          alt={projectData.title}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full">
        <div className="flex flex-col justify-center h-full text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {projectData.title}
          </h1>
          <p className="text-xl md:text-2xl">{projectData.location}</p>
        </div>
      </div>
    </div>
  );
}
