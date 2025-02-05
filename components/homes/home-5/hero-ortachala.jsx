"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HeroOrtachala() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const pathname = usePathname();
  const currentLang = pathname.includes("/ka") ? "ge" : "en";

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

  const settings1 = {
    spaceBetween: 30,
    slidesPerView: 4,
    slidesPerGroup: 1,
    loop: true,
    modules: [Navigation, Autoplay],
    autoplay: {
      delay: 10000,
    },
    breakpoints: {
      1399: {
        slidesPerView: 4,
      },
      800: {
        slidesPerView: 3,
      },
      500: {
        slidesPerView: 2,
      },
      400: {
        slidesPerView: 1,
      },
      350: {
        slidesPerView: 1,
      },
      150: {
        slidesPerView: 1,
      },
    },
  };

  const settings2 = {
    slidesPerView: 1,
    loop: true,
    navigation: {
      nextEl: ".snbn11",
      prevEl: ".snbp11",
    },
    modules: [Navigation, Autoplay],
    autoplay: {
      delay: 10000,
    },
    onSlideChange: (swiper) => {
      setActiveIndex(swiper.realIndex);
    },
  };

  if (loading) {
    return (
      <div
        className="section banner-home5 flex items-center justify-center"
        style={{ minHeight: "800px" }}
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // თუ პროექტები ცარიელია
  if (projects.length === 0) {
    return (
      <div
        className="section banner-home5 flex items-center justify-center"
        style={{ minHeight: "800px" }}
      >
        <p className="text-xl">No projects found</p>
      </div>
    );
  }

  return (
    <section className="section banner-home5">
      <div className="box-banner-homepage-2">
        <div
          className="box-cover-image"
          style={{
            backgroundImage: `url(${
              projects[activeIndex]?.main_image_url ||
              "/assets/imgs/page/homepage5/banner.png"
            })`,
            transition: "background-image 0.3s ease-in-out",
          }}
        ></div>

        <div className="box-banner-info">
          <div className="box-swiper">
            <Swiper
              {...settings2}
              style={{ maxWidth: "100%", overflow: "hidden" }}
              className="swiper-container swiper-banner-1 pb-0"
            >
              {projects.map((project) => (
                <SwiperSlide key={project.id} className="swiper-slide">
                  <p className="heading-52-medium color-white wow fadeInUp">
                    {currentLang === "ge" ? project.title_ge : project.title_en}
                  </p>
                  <h2 className="text-16 color-white wow fadeInUp">
                    {currentLang === "ge"
                      ? project.description_ge
                      : project.description_en}
                  </h2>
                  <div className="mt-30 wow fadeInUp">
                    <Link
                      className="btn btn-border"
                      href={`/projects/${project.id}`}
                    >
                      {currentLang === "ge" ? "პროექტის ნახვა" : "View Project"}
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
                        ></path>
                      </svg>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="box-pagination-button box-pagination-button-2">
              <div className="swiper-button-prev swiper-button-prev-banner swiper-button-prev-banner-2 snbp11">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  ></path>
                </svg>
              </div>
              <div className="swiper-button-next swiper-button-next-banner swiper-button-next-banner-2 snbn11">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="box-services-banner">
          <div className="container-sub">
            <div className="box-swiper">
              <Swiper
                {...settings1}
                className="swiper-container swiper-group-4 pb-0"
              >
                {projects.map((project) => (
                  <SwiperSlide key={project.id} className="swiper-slide">
                    <div className="cardService h-72 rounded-2xl overflow-hidden relative group">
                      <Link href={`/project-details/${project.id}`}>
                        <div className="cardImage relative w-full h-full">
                          <div className="absolute inset-0 z-10 transition-colors duration-300 group-hover:bg-green-300/50" />
                          <Image
                            width={370}
                            height={400}
                            src={project.main_image_url}
                            alt={
                              currentLang === "ge"
                                ? project.title_ge
                                : project.title_en
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="cardInfo absolute bottom-0 left-0 p-4 z-20">
                          <h3 className="text-20-medium text-white mb-10">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
