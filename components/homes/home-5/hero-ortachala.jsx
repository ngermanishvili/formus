"use client";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

const banners = [
  {
    id: 1,
    url: "/assets/imgs/page/homepage1/banner.png",
    title: "Ortachala Hills",
    text: "Ortachala hills is a place where you can find peace and tranquility in the heart of Tbilisi.",
  },
];

export default function HeroOrtachala() {
  const swiperSettings = {
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
  };

  return (
    <section className="section banner-home5">
      <div className="box-banner-homepage-2">
        <div
          className="relative w-full h-[800px] bg-cover bg-center"
          style={{
            backgroundImage: "url(/assets/imgs/page/homepage5/banner.png)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        </div>

        <div className="box-banner-info">
          <div className="box-swiper">
            <Swiper {...swiperSettings}>
              {banners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <p className="text-16 color-white wow fadeInUp">
                    {banner.title}
                  </p>
                  <h2 className="heading-52-medium color-white wow fadeInUp">
                    {banner.text}
                  </h2>
                  <div className="mt-30 wow fadeInUp">
                    <Link
                      className="btn btn-border"
                      href={`/project-details/${banner.id}`}
                    >
                      View Our Fleet
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
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="box-pagination-button box-pagination-button-2">
              <button className="swiper-button-prev swiper-button-prev-banner swiper-button-prev-banner-2 snbp11">
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
              </button>
              <button className="swiper-button-next swiper-button-next-banner swiper-button-next-banner-2 snbn11">
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
