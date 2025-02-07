"use client";
// DesktopProjects.jsx
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { slugify, transliterate } from "@/utils/slugify";

const baseSettings = {
  modules: [Navigation, Autoplay],
  autoplay: {
    delay: 10000,
    disableOnInteraction: false,
  },
};

const breakpoints = {
  0: {
    slidesPerView: 1,
    spaceBetween: 10,
  },
  480: {
    slidesPerView: 1,
    spaceBetween: 15,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 2,
    spaceBetween: 25,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 30,
  },
  1280: {
    slidesPerView: 4,
    spaceBetween: 30,
  },
};

export default function DesktopProjects({ projects, currentLang }) {
  const getProjectSlug = (project) => {
    const title = currentLang === "ge" ? project.title_ge : project.title_en;
    const transliteratedTitle =
      currentLang === "ge" ? transliterate(title) : title;
    return slugify(transliteratedTitle);
  };

  return (
    <div className="box-services-banner">
      <div className="container-sub px-4 md:px-8">
        <div className="box-swiper">
          {projects.length > 0 && (
            <Swiper
              {...baseSettings}
              breakpoints={breakpoints}
              loop={projects.length > 4}
              className="swiper-container swiper-group-4 pb-0"
            >
              {projects.map((project) => (
                <SwiperSlide key={project.id} className="swiper-slide">
                  <div className="cardService cardServiceStyle3">
                    <Link
                      href={`/projects/${project.id}/${getProjectSlug(
                        project
                      )}`}
                    >
                      <div className="cardImage">
                        <Image
                          width={370}
                          height={400}
                          src={project.main_image_url}
                          alt={
                            currentLang === "ge"
                              ? project.title_ge
                              : project.title_en
                          }
                          priority
                          className="w-full h-full object-cover overflow-hidden"
                        />
                      </div>
                      <div className="cardInfo">
                        <h3
                          suppressHydrationWarning
                          className="cardTitle text-base md:text-lg lg:text-xl color-white mb-2 md:mb-3"
                        >
                          {currentLang === "ge"
                            ? project.title_ge
                            : project.title_en}
                        </h3>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}
