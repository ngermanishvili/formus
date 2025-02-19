"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import FooterLogo from "@/public/assets/shapes/home/footer-logo.png";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  PiFacebookLogo,
  PiInstagramLogo,
  PiLinkedinLogo,
} from "react-icons/pi";

const translations = {
  en: {
    workingHours: "Working Hours",
    monToFri: "Mon- Sat: 10:00 - 18:00",
    saturday: "Sat: 11:00 - 17:00",
  },
  ka: {
    workingHours: "სამუშაო საათები",
    monToFri: "ორშ-პარ: 10:00 - 18:00",
    saturday: "შაბ: 11:00 - 17:00",
  },
};

export default function Footer() {
  const locale = useLocale();
  const t = translations[locale];
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/contactinfo");
        const data = await response.json();
        if (data.status === "success") {
          setContactInfo(data.data);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContactInfo();
  }, []);

  if (!contactInfo) {
    return null;
  }

  const getLocalizedAddress = () => {
    return locale === "ka"
      ? contactInfo.address_line_ge
      : contactInfo.address_line_en;
  };

  return (
    <footer className="bg-[#003366] w-full py-16">
      <div className="mx-auto max-w-7xl px-4 max-md:pt-72">
        {/* Logo */}
        <div className="flex justify-between  items-center w-[90%] mx-auto max-md:flex-col min-md:w-[100%] relative ">
          <div
            className="flex justify-start min-[2000px]:-ml-48
"
          >
            <Link href={`/${locale}`}>
              <Image
                src={FooterLogo}
                alt="Formus Logo"
                width={100}
                height={100}
                className="w-auto h-auto mt-8  "
              />
            </Link>
          </div>
          <div className="flex justify-end  gap-4 mr-[70px] max-md:ml-[0px] max-md:justify-center ">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <PiFacebookLogo className="text-white" size={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <PiInstagramLogo className="text-white" size={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <PiLinkedinLogo className="text-white" size={24} />
            </a>
          </div>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {/* Address Section */}
          <div className="flex flex-col items-start text-center max-md:items-center max-md:mt-4 ">
            <h6 className="text-white/60 text-sm font-medium mb-4">
              {locale === "ka" ? "მისამართი" : "Address"}
            </h6>
            <div className="flex items-start justify-center max-md-items-end">
              <MapPin className="text-white mr-2 flex-shrink-0 " size={20} />
              <p className="text-white text-sm">{getLocalizedAddress()}</p>
            </div>
          </div>

          {/* Phone/Email Section */}
          <div className="flex flex-col items-center text-center">
            <h6 className="text-white/60 text-sm font-medium mb-4">
              {locale === "ka" ? "ტელეფონი/ელ-ფოსტა" : "Phone/E-mail"}
            </h6>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Phone className="text-white mr-2" size={20} />
                <a
                  href={`tel:${contactInfo.phone_number}`}
                  className="text-white text-sm hover:opacity-80 transition-opacity"
                >
                  {contactInfo.phone_number}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="text-white mr-2" size={20} />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-white text-sm hover:opacity-80 transition-opacity"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* Working Hours Section */}
          <div className="flex flex-col items-center text-center">
            <h6 className="text-white/60 text-sm font-medium mb-4">
              {t.workingHours}
            </h6>
            <div className="flex items-start">
              <Clock className="text-white mr-2" size={20} />
              <div className="text-white text-sm">
                <p>{t.monToFri}</p>
                <p className="mr-10">{t.saturday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons */}
      </div>
    </footer>
  );
}
