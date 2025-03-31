"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import SecondShape2 from "@/public/assets/shapes/project/1.png";
import InteractiveSection from "./interactive-section";
import BreadCumpShape from "@/public/assets/shapes/home/2.png";
import Link from "next/link";
import ProjectContPhotos from "@/public/assets/imgs/ortachala/ortachala.png";

const ProjectContent = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [galleryData, setGalleryData] = useState(null);
  const [openImageIndex, setOpenImageIndex] = useState(null);
  const [loadingGallery, setLoadingGallery] = useState(true);

  const pathname = usePathname();
  const currentLang = pathname.includes("/ka") ? "ge" : "en";

  // ფოლბეკ პროექტის ფოტოები (გამოყენებული იქნება თუ API-დან ვერ ჩაიტვირთება)
  const defaultProjectImages = [
    {
      img: "/assets/ortachala-project/four.png",
      alt: "Project View 4",
    },
    {
      img: "/assets/ortachala-project/three.png",
      alt: "Project View 3",
    },
    {
      img: "/assets/ortachala-project/two.png",
      alt: "Project View 2",
    },
    {
      img: "/assets/ortachala-project/one.png",
      alt: "Project View 1",
    },
  ];

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
        const response = await fetch(`/api/projects/${id}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();

        if (data.status === "success" && data.data) {
          const project = data.data;

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

    // ფეტჩი გალერეის სექციის მონაცემებისთვის
    const fetchGalleryData = async () => {
      try {
        setLoadingGallery(true);
        const response = await fetch(`/api/projects/${id}/info`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const result = await response.json();

        if (result.status === "success") {
          // ფილტრაცია gallery_section ტიპის მონაცემებისთვის
          const galleryItems = result.data.filter(
            (item) => item.section_type === "gallery_section"
          );

          if (galleryItems.length > 0) {
            console.log("Found gallery section data:", galleryItems);
            setGalleryData(galleryItems[0]); // ვიღებთ პირველ გალერეის სექციას
          }
        }
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setLoadingGallery(false);
      }
    };

    if (id) {
      fetchData();
      fetchGalleryData();
    }
  }, [id, currentLang]);

  // მოდალის დახურვის ფუნქცია Escape ღილაკის დაჭერით
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenImageIndex(null);
      }
    };

    if (openImageIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openImageIndex]);

  // გალერეის ფოტოების მასივის მიღება - დინამიური ან ფოლბეკ
  const getGalleryImages = () => {
    if (galleryData?.image_url) {
      try {
        // სცადეთ პარსინგი, ჯერ გავასუფთაოთ ყველა გარე კავიჭისგან
        const cleanJsonString = galleryData.image_url.replace(/^["'](.*)["']$/, '$1');
        console.log("Attempting to parse gallery JSON:", cleanJsonString);
        
        let galleryImages;
        try {
          // მცდელობა JSON პარსინგის
          galleryImages = JSON.parse(cleanJsonString);
        } catch (e) {
          console.error("JSON parsing error, trying alternative method:", e);
          // თუ ვერ დაპარსა, შევეცადოთ სტრინგიდან მასივის მიღებას რეგულარული გამოსახულებით
          const urlMatches = galleryData.image_url.match(/(https?:\/\/[^"'\s]+)/g);
          if (urlMatches && urlMatches.length > 0) {
            galleryImages = urlMatches;
          }
        }
        
        if (Array.isArray(galleryImages) && galleryImages.length > 0) {
          console.log("Successfully parsed gallery images:", galleryImages);
          return galleryImages.map((url, index) => {
            // გავასუფთაოთ ნებისმიერი კავიჭებისგან და სხვა არასასურველი სიმბოლოებისგან
            const cleanUrl = typeof url === 'string' ? url.replace(/['"]/g, '') : '';
            return {
              img: cleanUrl,
              alt: `${projectData?.title || 'Project'} View ${index + 1}`,
            };
          });
        } else if (typeof galleryData.image_url === 'string' && galleryData.image_url.includes('http')) {
          // თუ ერთი URL-ია სტრინგში
          const cleanUrl = galleryData.image_url.replace(/['"]/g, '');
          console.log("Single URL detected in gallery:", cleanUrl);
          return [
            {
              img: cleanUrl,
              alt: `${projectData?.title || 'Project'} View`,
            }
          ];
        }
      } catch (error) {
        console.error("Error processing gallery images:", error, galleryData.image_url);
      }
    }

    console.log("Using default gallery images");
    // ფოლბეკ მასივი
    return defaultProjectImages;
  };

  // სექციის სათაურის მიღება
  const getGallerySectionTitle = () => {
    if (galleryData) {
      return currentLang === "ge"
        ? galleryData.title_ge
        : galleryData.title_en || "Project is financed by TBC Bank";
    }
    return currentLang === "ge"
      ? "პროექტი დაფინანსებულია თიბისი ბანკის მიერ"
      : "Project is financed by TBC Bank";
  };

  // სექციის აღწერის მიღება
  const getGallerySectionDescription = () => {
    if (galleryData) {
      return currentLang === "ge"
        ? galleryData.description_ge
        : galleryData.description_en || projectData?.description;
    }
    return projectData?.description;
  };

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

  const projectImages = getGalleryImages();

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
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
            className="w-[180px]  object-contain"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="w-full mx-auto px-0   max-w-[1000px]">
            <h1 className="font-firago font-bold text-4xl md:text-6xl text-white mb-4">
              {projectData.title}
            </h1>

            <Link className="btn btn-border mt-2" href="/choose-apartment">
              {currentLang === "ge" ? "შეარჩიეთ ბინა" : "Choose an apartament"}
              <svg
                className="icon-16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-[1080px] px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-[100px] justify-end">
          <div className="w-full relative">
            {/* Content container */}
            <div className="relative z-20 text-left">
              <h2 className="font-firago font-bold text-3xl lg:text-3xl text-foreground mb-6 lg:mb-8 leading-tight">
                {getGallerySectionTitle()}
              </h2>

              <p className="font-firago text-lg font-light">
                {getGallerySectionDescription()}
              </p>
            </div>

            {/* Decorative shape - positioned below content */}
            <div className="absolute left-[-14px] top-0 z-10">
              <Image
                src={BreadCumpShape}
                alt="Decorative shape"
                width={90}
                height={90}
                className="w-[90px] h-[90px]"
              />
            </div>
          </div>

          <div className="w-full lg:w-[1200px] mb-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {projectImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-52 group overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => setOpenImageIndex(index)}
                >
                  <img
                    src={image.img}
                    alt={image.alt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {openImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenImageIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={projectImages[openImageIndex].img}
              alt={projectImages[openImageIndex].alt}
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/80 rounded-full p-2"
              onClick={() => setOpenImageIndex(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Second Section */}
      <section className="relative bg-background">
        <InteractiveSection projectData={projectData} projectId={id} />
      </section>

      {/* Add map if available */}
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
