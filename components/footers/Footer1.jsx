"use client";

import { legalLinks } from "@/data/footerLinks";
import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";

export default function Footer5() {
  // სოციალური მედიის ლინკები
  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      className: "icon-socials icon-facebook",
    },
    {
      name: "Instagram",
      href: "#",
      className: "icon-socials icon-instagram",
    },
    {
      name: "LinkedIn",
      href: "#",
      className: "icon-socials icon-linkedin",
    },
  ];

  return (
    <footer className="footer footer-5">
      <div className="footer-1">
        <div className="container-sub">
          {/* ზედა ნაწილი - ლოგო და სოციალური მედია */}
          <div className="box-footer-top">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6 text-md-start text-center mb-15 wow fadeInUp">
                <div className="d-flex align-items-center justify-content-md-start justify-content-center">
                  <Link href="/" className="mr-30">
                    <span className="text-2xl font-bold text-white">
                      FORMUS
                    </span>
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 text-md-end text-center mb-15 wow fadeInUp">
                <div className="d-flex align-items-center justify-content-md-end justify-content-center">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className={link.className}
                      aria-label={link.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* საკონტაქტო ინფორმაცია */}
          <div className="row mb-40">
            <div className="col-lg-4 wow fadeInUp">
              <h6 className="text-14 color-white-2 mb-20">მისამართი</h6>
              <div className="flex items-center mb-2">
                <MapPin className="text-white mr-2" size={20} />
                <p className="color-white">
                  სულიკო ტორტლაძის ქუჩა, თბილისი, საქართველო
                </p>
              </div>
            </div>

            <div className="col-lg-4 wow fadeInUp">
              <h6 className="text-14 color-white-2 mb-20">ტელეფონი</h6>
              <div className="flex items-center mb-2">
                <Phone className="text-white mr-2" size={20} />
                <a
                  className="text-14-medium color-white hover-up"
                  href="tel:+995593939093"
                >
                  +(995) 593 93 90 93
                </a>
              </div>
            </div>

            <div className="col-lg-4 wow fadeInUp">
              <h6 className="text-14 color-white-2 mb-20">სამუშაო საათები</h6>
              <div className="flex items-center mb-2">
                <Clock className="text-white mr-2" size={20} />
                <span className="text-14-medium color-white">
                  ორშაბათი-პარასკევი 10:00 - 18:00; შაბათი 11:00 - 17:00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ქვედა ნაწილი - საავტორო უფლებები და ლინკები */}
      <div className="footer-2">
        <div className="container-sub">
          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-12 text-center text-lg-start">
                <span className="text-14 color-white mr-50">
                  © {new Date().getFullYear()} Formus
                </span>
                <ul className="menu-bottom">
                  {legalLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-4 col-md-12 text-center text-lg-end">
                <span className="text-14 color-white">
                  Developed by Render Group
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
