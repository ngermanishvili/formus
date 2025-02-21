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

export default function Footer5() {
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
    if (locale === "ka") {
      return contactInfo.address_line_ge.replace("თბილისი", "\nთბილისი");
    } else {
      return contactInfo.address_line_en.replace("Tbilisi", "\nTbilisi");
    }
  };

  return (
    <footer className="w-full bg-[#00326B]">
      {/* Mobile Footer */}
      <div className="block md:hidden">
        {/* Mobile footer content can be added here */}
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl w-[1280px] px-40 pt-24">
          {/* Top Section */}
          <div className="py-8 border-b border-gray-700">
            <div className="flex items-center justify-between w-[90%] mx-auto">
              <div className="w-[150px]">
                <Link href={`/${locale}`}>
                  <Image
                    src={FooterLogo}
                    alt="Formus"
                    width={100}
                    height={100}
                    className="w-auto h-auto"
                  />
                </Link>
              </div>
              <div className="flex justify-end gap-4">
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
          </div>

          {/* Middle Section */}
          <div className="py-12 grid grid-cols-3 gap-8">
            {/* Address Section */}
            <div className="flex flex-col items-start">
              <h6 className="text-white/60 text-sm font-medium mb-4">
                {locale === "ka" ? "მისამართი" : "Address"}
              </h6>
              <div className="flex items-start">
                <MapPin className="text-white mr-2 flex-shrink-0" size={20} />
                <p className="text-white text-sm whitespace-pre-line">
                  {getLocalizedAddress()}
                </p>
              </div>
            </div>

            {/* Phone/Email Section */}
            <div className="flex flex-col items-center">
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
            <div className="flex flex-col items-center">
              <h6 className="text-white/60 text-sm font-medium mb-4">
                {t.workingHours}
              </h6>
              <div className="flex items-start">
                <Clock className="text-white mr-2" size={20} />
                <div className="text-white text-sm">
                  <p>{t.monToFri}</p>
                  <p>{t.saturday}</p>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
