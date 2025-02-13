"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";
import FooterLogo from "@/public/assets/shapes/home/footer-logo.png";
import Image from "next/image";
import { useLocale } from "next-intl";

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

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: <Facebook className="w-6 h-6 text-white" />,
    },
    {
      name: "Instagram",
      href: "#",
      icon: <Instagram className="w-6 h-6 text-white" />,
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: <Linkedin className="w-6 h-6 text-white" />,
    },
  ];

  if (!contactInfo) {
    return null;
  }

  const getLocalizedAddress = () => {
    return locale === "ka"
      ? contactInfo.address_line_ge
      : contactInfo.address_line_en;
  };

  return (
    <footer className="bg-[#003366] w-full ">
      <div className="container mx-auto px-4">
        {/* Logo and Social Links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 xl:mb-12"></div>
        <div className="flex justify-between mt-[120px]">
          <Link href={`/${locale}`} className="mb-6 md:mb-0">
            <Image
              src={FooterLogo}
              alt="Formus Logo"
              width={300}
              height={300}
            />
          </Link>
          <div className="flex justify-end -mr-8 mt-[80px]">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="hover:opacity-80 transition-opacity p-3"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-[60px]">
          <div>
            <h6 className="text-white/60 text-sm font-medium mb-4">
              {locale === "ka" ? "მისამართი" : "Address"}
            </h6>
            <div className="flex items-center">
              <MapPin className="text-white mr-2 flex-shrink-0" size={20} />
              <p className="text-white">{getLocalizedAddress()}</p>
            </div>
          </div>

          <div>
            <h6 className="text-white/60 text-sm font-medium mb-4">
              {locale === "ka" ? "ტელეფონი/ელ-ფოსტა" : "Phone/E-mail"}
            </h6>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Phone className="text-white mr-2" size={20} />

                <a
                  href={`tel:${contactInfo.phone_number}`}
                  className="text-white text-sm hover:opacity-80"
                >
                  {contactInfo.phone_number}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="text-white mr-2" size={20} />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-white hover:opacity-80 text-sm"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h6 className="text-white/60 text-sm font-medium mb-4">
                {t.workingHours}
              </h6>
              <div className="flex items-center">
                <Clock className="text-white mr-2 flex-shrink-0" size={20} />
                <div className="text-white text-sm">
                  <p className="firago-thin">{t.monToFri}</p>
                  <p>{t.saturday}</p>
                </div>
              </div>
            </div>
            <div className="text-white text-sm ml-8 mt-[44px]">
              {t.termsAndConditions}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-6"></div>
      </div>
    </footer>
  );
}
