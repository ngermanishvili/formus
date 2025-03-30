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
      <div className="container mx-auto max-w-7xl px-4">
        <div className="py-4">
          {/* Main Footer Content */}
          <div className="flex justify-between items-center relative">
            {/* Logo Section - Left */}
            <div className="-ml-[120px] mt-[60px] min-[2000px]:mt-[100px]">
              <Link href={`/${locale}`}>
                <Image
                  src={FooterLogo}
                  alt="Formus Logo"
                  width={120}
                  height={120}
                  className="w-auto h-auto min-[2000px]:w-[200px] min-[2000px]:h-[200px]"
                />
              </Link>
            </div>

            {/* Social Icons - Right */}
            <div className="flex gap-4 -mr-20 min-[2000px]:mt-[100px] min-[2000px]:-mr-[-140px] mt-[60px]">
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
          <div className="grid grid-cols-12 gap-4 mt-16 mb-4">
            {/* Left Section - Address */}
            <div className="col-span-2 flex flex-col -ml-20 w-[250px]">
              <h6 className="text-white/60 text-sm font-medium mb-4">
                {locale === "ka" ? "მისამართი" : "Address"}
              </h6>
              <div className="flex items-start">
                <MapPin
                  className="text-white mr-2 flex-shrink-0 mt-1"
                  size={20}
                />
                <p className="text-white text-sm">{getLocalizedAddress()}</p>
              </div>
            </div>

            {/* Center Section - Contact */}
            <div className="col-span-4 flex flex-col items-center">
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

            {/* Right Section - Working Hours */}
            <div className="col-span-4 flex flex-col items-center -mr-[170px]">
              <h6 className="text-white/60 text-sm font-medium mb-4 -mr-[-200px]">
                {t.workingHours}
              </h6>
              <div className="flex items-start gap-14">
                <div className="flex items-center">
                  <Clock className="text-white mr-2" size={20} />
                  <div className="text-white text-sm">
                    <p>{t.monToFri}</p>
                    <p>{t.saturday}</p>
                  </div>
                </div>
                <Link
                  href="#"
                  className="text-white text-sm hover:opacity-80 transition-opacity"
                >
                  {t.termsAndConditions}
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Bottom Border */}
          <div className="border-t border-white/10 pt-4"></div>
        </div>
      </div>
    </footer>
  );
}
