"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useLocale } from "next-intl";

export default function Offices() {
  const locale = useLocale();
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
    return null; // ან loading სფინერი
  }

  const getLocalizedAddress = () => {
    return locale === "ka"
      ? contactInfo.address_line_ge
      : contactInfo.address_line_en;
  };

  const contactCards = [
    {
      city: locale === "ka" ? "თბილისი" : "Tbilisi",
      address: getLocalizedAddress(),
      phone: contactInfo.phone_number,
      email: contactInfo.email,
      map_url: contactInfo.map_url,
    },
  ];

  return (
    <div className="section pt-60 pb-60 bg-gray-50 w-full">
      <div className="container-sub w-full">
        <div className="row flex flex-row">
          {contactCards.map((elm, i) => (
            <div key={i} className="col-lg-2 col-sm-6 mb-30 w-full">
              <div className="cardContact wow fadeInUp bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="cardInfo flex flex-col space-y-4">
                  <div className="flex items-start group">
                    <MapPin className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 group-hover:text-blue-700 transition-colors" />
                    <p className="text-16 text-gray-600 group-hover:text-gray-800 transition-colors">
                      {elm.address}
                    </p>
                  </div>

                  <div className="flex items-center group">
                    <Phone className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 group-hover:text-blue-700 transition-colors" />
                    <a
                      href={`tel:${elm.phone}`}
                      className="text-16 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {elm.phone}
                    </a>
                  </div>

                  <div className="flex items-center group">
                    <Mail className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 group-hover:text-blue-700 transition-colors" />
                    <a
                      href={`mailto:${elm.email}`}
                      className="text-16 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {elm.email}
                    </a>
                  </div>
                </div>

                {elm.map_url && (
                  <div className="mt-6">
                    <iframe
                      src={elm.map_url}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
