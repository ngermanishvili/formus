import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import FooterLogo from "@/public/assets/shapes/home/footer-logo.png";
import Image from "next/image";
import { useLocale } from "next-intl";

const translations = {
  en: {
    address: "Address",
    addressText: "5, Sulkhan Tsintsadze Street, Tbilisi, Georgia",
    phoneEmail: "Phone/E-mail",
    workingHours: "Working Hours",
    monToFri: "Mon- Sat: 10:00 - 18:00",
    saturday: "Sat: 11:00 - 17:00",
    termsAndConditions: "Terms and Conditions",
  },
  ka: {
    address: "მისამართი",
    addressText: "სულხან ცინცაძის ქ. 5, თბილისი, საქართველო",
    phoneEmail: "ტელეფონი/ელ-ფოსტა",
    workingHours: "სამუშაო საათები",
    monToFri: "ორშ-პარ: 10:00 - 18:00",
    saturday: "შაბ: 11:00 - 17:00",
    termsAndConditions: "წესები და პირობები",
  },
};

export default function Footer() {
  const locale = useLocale();
  const t = translations[locale];

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 20 20">
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 20 20">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: (
        <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 20 20">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#003366] w-full">
      <div className="container mx-auto px-4">
        <div className="min-h-[58vh] flex flex-col justify-end pb-8">
          {/* Logo and Social Links */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <Link href={`/${locale}`} className="mb-6 md:mb-0">
              <Image
                src={FooterLogo}
                alt="Formus Logo"
                width={200}
                height={200}
              />
            </Link>
            <div className="flex items-center space-x-6">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="hover:opacity-80 transition-opacity"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div>
              <h6 className="text-white/60 text-sm font-medium mb-4">
                {t.address}
              </h6>
              <div className="flex items-center">
                <MapPin className="text-white mr-2 flex-shrink-0" size={20} />
                <p className="text-white">{t.addressText}</p>
              </div>
            </div>

            <div>
              <h6 className="text-white/60 text-sm font-medium mb-4">
                {t.phoneEmail}
              </h6>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <Phone className="text-white mr-2" size={20} />
                  <a
                    href="tel:+995593939093"
                    className="text-white text-sm hover:opacity-80"
                  >
                    +(995) 593 93 90 93
                  </a>
                </div>
                <a
                  href="mailto:info@formus.ge"
                  className="text-white hover:opacity-80 ml-7"
                >
                  info@formus.ge
                </a>
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
      </div>
    </footer>
  );
}
