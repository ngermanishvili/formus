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
    termsAndConditions: "Terms and Conditions",
  },
  ka: {
    workingHours: "სამუშაო საათები",
    monToFri: "ორშ-პარ: 10:00 - 18:00",
    saturday: "შაბ: 11:00 - 17:00",
    termsAndConditions: "წესები და პირობები",
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
    <footer className="bg-[#003366] w-full">
      <div className="mx-[50px] px-4 py-8">
        {/* Logo and Social Links Container */}
        <div className="flex flex-col md:flex-row justify-between items-center ">
          <Link href={`/${locale}`} className="mb-6 md:mb-0">
            <Image
              src={FooterLogo}
              alt="Formus Logo"
              width={200}
              height={200}
              className="w-auto h-auto mr-8"
            />
          </Link>
          <div className="flex gap-2">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <PiFacebookLogo className="text-white" size={30} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <PiInstagramLogo className="text-white" size={30} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <PiLinkedinLogo className="text-white" size={30} />
            </a>
          </div>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-md:text-center max-md:mt-12">
          {/* Address Section */}
          <div>
            <h6 className="text-white/60 text-sm font-medium mb-4">
              {locale === "ka" ? "მისამართი" : "Address"}
            </h6>
            <div className="flex items-start">
              <MapPin
                className="text-white mr-2 flex-shrink-0 mt-1 max-md:ml-3"
                size={20}
              />
              <p className="text-white">{getLocalizedAddress()}</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="max-md:text-center max-md:flex max-md:flex-col max-md:items-center">
            <h6 className="text-white/60 text-sm font-medium mb-4">
              {locale === "ka" ? "ტელეფონი/ელ-ფოსტა" : "Phone/E-mail"}
            </h6>
            <div className="flex flex-col space-y-2 ">
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
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h6 className="text-white/60 text-sm font-medium mb-4 ml-7">
                {t.workingHours}
              </h6>

              <div className="flex items-start">
                <Clock className="text-white mr-2" size={20} />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-white text-sm hover:opacity-80 transition-opacity"
                >
                  <p className="firago-thin">{t.monToFri}</p>
                  <p>{t.saturday}</p>
                </a>
              </div>
            </div>
            <div className="text-white text-sm mt-4 md:mt-[44px] md:ml-8">
              <Link href="#" className="hover:opacity-80 transition-opacity">
                {t.termsAndConditions}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom Border */}
        <div className="border-t border-white/10 pt-6"></div>
      </div>
    </footer>
  );
}
