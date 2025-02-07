"use client";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { slugify, transliterate } from "@/utils/slugify";

const baseSettings = {
  modules: [Navigation, Autoplay],
  autoplay: {
    delay: 10000,
    disableOnInteraction: false,
  },
};

// Updated breakpoints for better responsiveness
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

export default function Hero() {
  const getProjectSlug = (project) => {
    const title = currentLang === "ge" ? project.title_ge : project.title_en;
    const transliteratedTitle =
      currentLang === "ge" ? transliterate(title) : title;
    return slugify(transliteratedTitle);
  };

  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState({
    sliders: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const pathname = usePathname();
  const currentLang = pathname?.includes("/ka") ? "ge" : "en";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [slidersRes, projectsRes] = await Promise.all([
          fetch("/api/sliders"),
          fetch("/api/projects"),
        ]);

        const [slidersData, projectsData] = await Promise.all([
          slidersRes.json(),
          projectsRes.json(),
        ]);

        setData({
          sliders: slidersData.status === "success" ? slidersData.data : [],
          projects: projectsData.status === "success" ? projectsData.data : [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <section className="section banner-home5">
      <div className="box-banner-homepage-2">
        <div
          className="box-cover-image"
          suppressHydrationWarning
          style={{
            backgroundImage: `url(${
              data.sliders[activeIndex]?.image_url ||
              "/assets/imgs/page/homepage5/banner.png"
            })`,
            transition: "background-image 0.3s ease-in-out",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="box-banner-info">
          <div className="box-swiper">
            {data.sliders.length > 0 && (
              <Swiper
                {...baseSettings}
                slidesPerView={1}
                loop={data.sliders.length > 1}
                navigation={{
                  nextEl: ".snbn11",
                  prevEl: ".snbp11",
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="swiper-container swiper-banner-1 pb-0"
              >
                {data.sliders.map((slider) => (
                  <SwiperSlide key={slider.id} className="swiper-slide">
                    <div
                      suppressHydrationWarning
                      className="px-4 md:px-8 lg:px-12"
                    >
                      <p className="heading-52-medium color-white wow fadeInUp text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                        {currentLang === "ge"
                          ? slider.title_ge
                          : slider.title_en}
                      </p>
                      <h2 className="text-base md:text-lg lg:text-xl color-white wow fadeInUp mt-4">
                        {currentLang === "ge"
                          ? slider.description_ge
                          : slider.description_en}
                      </h2>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            <div className="box-pagination-button box-pagination-button-2">
              <div className="swiper-button-prev swiper-button-prev-banner swiper-button-prev-banner-2 snbp11">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8"
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
                  />
                </svg>
              </div>
              <div className="swiper-button-next swiper-button-next-banner swiper-button-next-banner-2 snbn11">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8"
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
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="box-services-banner">
          <div className="container-sub px-4 md:px-8"></div>
        </div>
      </div>
    </section>
  );
}
