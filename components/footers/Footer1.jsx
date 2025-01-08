import { legalLinks, socialMediaPlatforms } from "@/data/footerLinks";
import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";

export default function Footer5() {
  return (
    <footer className="footer footer-5">
      <div className="footer-1">
        <div className="container-sub">
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
                  {socialMediaPlatforms.map((elm, i) => (
                    <a key={i} className={elm.className} href={elm.href}></a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-40">
            <div className="col-lg-4 wow fadeInUp">
              <h6 className="text-14 color-white-2 mb-20">Address</h6>
              <div className="flex items-center mb-2">
                <MapPin className="text-white mr-2" size={20} />
                <p className="color-white">Tbilisi, Georgia</p>
              </div>
            </div>

            <div className="col-lg-4 wow fadeInUp">
              <h6 className="text-14 color-white-2 mb-20">Call Our Office</h6>
              <div className="flex items-center mb-2">
                <Phone className="text-white mr-2" size={20} />
                <a
                  className="text-14-medium  color-white hover-up"
                  href="tel:+995555555555"
                >
                  +(995) 555-555-555
                </a>
              </div>
            </div>

            <div className="col-lg-4 wow fadeInUp">
              <h6 className="text-14 color-white-2 mb-20">Working Hours</h6>
              <div className="flex items-center mb-2">
                <Clock className="text-white mr-2" size={20} />
                <span className="text-14-medium  color-white">
                  Mon-Sat: 09:00 - 17:00 - Sun: Closed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-2">
        <div className="container-sub">
          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-12 text-center text-lg-start">
                <span className="text-14 color-white mr-50">
                  © {new Date().getFullYear()} Formus
                </span>
                <ul className="menu-bottom">
                  {legalLinks.map((elm, i) => (
                    <li key={i}>
                      <Link href={elm.href}>{elm.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-4 col-md-12 text-center text-lg-end">
                <a className="btn btn-link-globe active" href="#">
                  English
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
