"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import FooterLogo from "@/public/assets/shapes/home/footer-logo.png";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  PiFacebookLogo,
  PiInstagramLogo,
  PiLinkedinLogo,
  PiTiktokLogo,
  PiYoutubeLogo,
} from "react-icons/pi";

const translations = {
  en: {
    workingHours: "Working Hours",
    monToFri: "Mon- Sat: 10:00 - 18:00",
    saturday: "Sat: 11:00 - 17:00",
    terms: "Terms & Conditions",
  },
  ka: {
    workingHours: "სამუშაო საათები",
    monToFri: "ორშაბათი-პარასკევი: 10:00 - 18:00",
    saturday: "შაბათი: 11:00 - 17:00",
    terms: "წესები და პირობები",
  },
};

export default function Footer5() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = translations[locale];
  const [contactInfo, setContactInfo] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);

  const isHomePage = pathname === `/${locale}` || pathname === "/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contact info
        const contactResponse = await fetch("/api/contactinfo");
        const contactData = await contactResponse.json();
        if (contactData.status === "success") {
          setContactInfo(contactData.data);
        }

        // Fetch social links
        const socialResponse = await fetch("/api/social-links");
        const socialData = await socialResponse.json();
        if (socialData.status === "success") {
          const sortedLinks = socialData.data
            .filter((link) => link.is_visible)
            .sort((a, b) => a.display_order - b.display_order);
          setSocialLinks(sortedLinks);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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

  const georgianTextClass =
    locale === "ka" ? "[font-feature-settings:'case'_on]" : "";

  const socialIcons = {
    facebook: PiFacebookLogo,
    instagram: PiInstagramLogo,
    linkedin: PiLinkedinLogo,
    tiktok: PiTiktokLogo,
    youtube: PiYoutubeLogo,
  };

  const FooterContent = ({ isMobile }) => (
    <div
      className={`${
        isMobile
          ? "px-6"
          : "mx-auto max-w-7xl w-[1280px] px-40 md:px-28 md:w-full xl:w-[1280px] xl:px-40"
      } ${isHomePage ? (isMobile ? "" : "") : ""}`}
    >
      {/* Logo and Social Media Section */}
      <div
        className={`py-8 border-b border-gray-700 ${isMobile ? "px-4" : ""}`}
      >
        <div
          className={`flex flex-col ${
            isMobile
              ? "items-center space-y-6"
              : "flex-row items-center justify-between mx-auto"
          }`}
        >
          <div
            className={`${
              isMobile ? "w-[120px]" : "w-[150px] translate-x-[-30%]"
            }`}
          >
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
          <div className="flex justify-center gap-2 relative z-0 mr-[5%]">
            {socialLinks.map((social) => {
              const IconComponent = socialIcons[social.platform_key];
              if (!IconComponent || !social.url) return null;

              return (
                <a
                  key={social.platform_key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity relative z-50"
                >
                  <IconComponent
                    className="text-white"
                    size={isMobile ? 28 : 24}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div
        className={`py-12 ${
          isMobile ? "space-y-12" : "grid grid-cols-3 gap-8"
        }`}
      >
        {/* Address Section */}
        <div
          className={`flex flex-col ${
            isMobile ? "items-center text-center" : "items-start"
          }`}
        >
          <h6
            className={`text-white/60 text-sm font-medium mb-6 lg:mr-[84px] ${georgianTextClass}`}
          >
            {locale === "ka" ? "მისამართი" : "Address"}
          </h6>
          <div className="flex items-center">
            <MapPin className="text-white mr-3 flex-shrink-0" size={20} />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://maps.app.goo.gl/8rUczLePMh8SSBFL6"
              className={`text-white text-sm whitespace-pre-line ${georgianTextClass}`}
            >
              {getLocalizedAddress()}
            </a>
          </div>
        </div>

        {/* Phone/Email Section */}
        <div
          className={`flex flex-col ${
            isMobile ? "items-center" : "items-center"
          }`}
        >
          <h6
            className={`text-white/60 text-sm font-medium mb-6 ml-4 ${georgianTextClass}`}
          >
            {locale === "ka" ? "ტელეფონი/ელ-ფოსტა" : "Phone/E-mail"}
          </h6>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <span className="w-6 flex justify-center">
                <Phone className="text-white" size={20} />
              </span>
              <a
                href={`tel:${contactInfo.phone_number}`}
                className="text-white text-sm hover:opacity-80 transition-opacity ml-3"
              >
                {contactInfo.phone_number}
              </a>
            </div>
            <div className="flex items-center">
              <span className="w-6 flex justify-center">
                <Mail className="text-white" size={20} />
              </span>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-white text-sm hover:opacity-80 transition-opacity ml-3"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
        </div>

        {/* Working Hours Section */}
        <div
          className={`flex flex-col ${
            isMobile ? "items-center" : "items-center"
          }`}
        >
          <h6
            className={`text-white/60 text-sm font-medium mb-6 lg:mr-[84px] ${georgianTextClass}`}
          >
            {t.workingHours}
          </h6>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center">
              <Clock className="text-white mr-3" size={20} />
              <div className={`text-white text-sm ${georgianTextClass}`}>
                <p>{t.monToFri}</p>
                <p>{t.saturday}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 py-6">
        <div
          className={`${
            isMobile
              ? "flex flex-col items-center space-y-4"
              : "flex items-center justify-between"
          }`}
        >
          <span className="text-gray-200 text-sm">
            © {new Date().getFullYear()} Formus
          </span>
          <Link
            className={`text-gray-200 text-sm hover:text-white transition-colors ${georgianTextClass}`}
            href={`/${locale}/terms`}
          >
            {t.terms}
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <footer className="w-full bg-[#00326B]">
      {/* Mobile Footer */}
      <div className="block md:hidden">
        <FooterContent isMobile={true} />
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <FooterContent isMobile={false} />
      </div>
    </footer>
  );
}
