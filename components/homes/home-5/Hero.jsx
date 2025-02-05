"use client";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { slugify, transliterate } from "@/utils/slugify";

// Swiper settings outside component to avoid re-creation
const baseSettings = {
  modules: [Navigation, Autoplay],
  autoplay: {
    delay: 10000,
    disableOnInteraction: false,
  },
};

const breakpoints = {
  1399: { slidesPerView: 4 },
  800: { slidesPerView: 3 },
  500: { slidesPerView: 2 },
  400: { slidesPerView: 1 },
  350: { slidesPerView: 1 },
  150: { slidesPerView: 1 },
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

  // Don't render anything until component is mounted
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
                style={{ maxWidth: "100%", overflow: "hidden" }}
                className="swiper-container swiper-banner-1 pb-0"
              >
                {data.sliders.map((slider) => (
                  <SwiperSlide key={slider.id} className="swiper-slide">
                    <div suppressHydrationWarning>
                      <p className="heading-52-medium color-white wow fadeInUp">
                        {currentLang === "ge"
                          ? slider.title_ge
                          : slider.title_en}
                      </p>
                      <h2 className="text-16 color-white wow fadeInUp">
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
          <div className="container-sub">
            <div className="box-swiper">
              {data.projects.length > 0 && (
                <Swiper
                  {...baseSettings}
                  spaceBetween={30}
                  slidesPerView={4}
                  slidesPerGroup={1}
                  loop={data.projects.length > 4}
                  breakpoints={breakpoints}
                  className="swiper-container swiper-group-4 pb-0"
                >
                  {data.projects.map((project) => (
                    <SwiperSlide key={project.id} className="swiper-slide">
                      <div className="cardService cardServiceStyle3  ">
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
                            />
                          </div>
                          <div className="cardInfo">
                            <h3
                              suppressHydrationWarning
                              className="cardTitle text-20-medium color-white mb-10"
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
      </div>
    </section>
  );
}
