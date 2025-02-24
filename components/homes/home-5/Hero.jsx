"use client";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import LeftomBottomShape from "@/public/assets/shapes/home/1.png";

const baseSettings = {
  modules: [Navigation, Autoplay],
  autoplay: {
    delay: 10000,
    disableOnInteraction: false,
  },
};

export default function Hero() {
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
              data.sliders[0]?.image_url ||
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
              <>
                <Swiper
                  {...baseSettings}
                  slidesPerView={1}
                  loop={data.projects.length > 1}
                  navigation={{
                    nextEl: ".snbn11",
                    prevEl: ".snbp11",
                  }}
                  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  className="swiper-container swiper-banner-1 pb-0"
                >
                  {data.sliders.map((slider) => (
                    <SwiperSlide key={slider.id} className="swiper-slide">
                      <div className=" mx-auto" />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className=" absolute ">
                  {/* <h2 className="text-base md:text-lg lg:text-xl color-white wow fadeInUp mt-4">
                    {currentLang === "ge"
                      ? data.sliders[0]?.description_ge
                      : data.sliders[0]?.description_en}
                  </h2> */}
                  <p className="heading-52-medium color-white wow fadeInUp text-2xl md:text-3xl lg:text-6xl xl:text-6xl">
                    {currentLang === "ge"
                      ? data.sliders[0]?.title_ge
                      : data.sliders[0]?.title_en}
                  </p>
                  {/* 
                  <Link
                    className="btn btn-border mt-2"
                    href="/projects/1/ortachala-hilsi"
                  >
                    {currentLang === "ge"
                      ? "მიმდინარე პროექტი"
                      : "Ongoing Project"}
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
                  </Link> */}
                </div>
              </>
            )}
            {/* 
            <div className="box-pagination-button box-pagination-button-2  md:px-16 lg:px-24 ">
              <div className="swiper-button-prev swiper-button-prev-banner swiper-button-prev-banner-2 snbp11 flex items-center justify-center min-[2000px]:ml-[-160px]">
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
              <div className="swiper-button-prev swiper-button-prev-banner swiper-button-prev-banner-2 snbp11 flex items-center justify-center min-[2000px]:ml-[-160px]">
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
            </div> */}
          </div>
        </div>
        <div className="box-services-banner">
          <div className="container-sub px-4 md:px-8"></div>
        </div>
        <div className="absolute bottom-0 right-0 z-10">
          <Image
            src={LeftomBottomShape}
            alt="Bottom shape"
            width={500}
            height={400}
            className="h-auto md:w-[500px] sm:w-[300px] w-[200px] transform-none"
            priority
          />
        </div>
      </div>
    </section>
  );
}
