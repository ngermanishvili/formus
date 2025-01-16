"use client";

import { services } from "@/data/services";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Hero() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch("/api/sliders");
        const data = await response.json();
        if (data.status === "success") {
          setSliders(data.data);
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
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
  };

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
          style={{
            backgroundImage: `url(${
              sliders[0]?.image_url || "assets/imgs/page/homepage5/banner.png"
            })`,
          }}
        ></div>
        <div className="box-banner-info">
          <div className="box-swiper">
            <Swiper
              {...settings2}
              style={{ maxWidth: "100%", overflow: "hidden" }}
              className="swiper-container swiper-banner-1 pb-0"
            >
              {sliders.map((slider) => (
                <SwiperSlide key={slider.id} className="swiper-slide">
                  <p className="text-16 color-white wow fadeInUp">
                    {slider.title}
                  </p>
                  <h2 className="heading-52-medium color-white wow fadeInUp">
                    {slider.description}
                  </h2>
                  <div className="mt-30 wow fadeInUp">
                    <Link className="btn btn-border" href="/fleet-list">
                      View Our Fleet
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
                  aria-hidden="true"
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
                  aria-hidden="true"
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
                {services.map((elm, i) => (
                  <SwiperSlide key={i} className="swiper-slide">
                    <div className="cardService cardServiceStyle3 wow fadeInUp">
                      <Link href={`/ortachala-hills`}>
                        <div className="cardImage">
                          <Image
                            width={370}
                            height={400}
                            src={elm.image}
                            alt="Luxride"
                          />
                        </div>
                        <div className="cardInfo">
                          <h3 className="cardTitle text-20-medium color-white mb-10">
                            {elm.title}
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
