import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useLocale } from "next-intl";

export default function Offices() {
  const locale = useLocale();

  const translations = {
    en: {
      city: "Tbilisi",
      address: "Suliko Tortladze Street, Tbilisi, Georgia",
    },
    ka: {
      city: "თბილისი",
      address: "სულიკო ტორტლაძის ქუჩა, თბილისი, საქართველო",
    },
  };

  const t = translations[locale];

  const contactCards = [
    {
      city: t.city,
      address: t.address,
      phone: "+(995) 593 93 90 93",
      email: "info@formus.ge",
    },
  ];

  return (
    <div className="section pt-60 pb-60 bg-gray-50 w-full">
      <div className="container-sub w-full">
        <div className="row flex flex-row">
          {contactCards.map((elm, i) => (
            <div key={i} className="col-lg-2 col-sm-6 mb-30 w-full">
              <div className="cardContact wow fadeInUp bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="cardInfo flex justify-between items-center">
                  <div className="flex items-start mb-20 group">
                    <MapPin className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 group-hover:text-blue-700 transition-colors" />
                    <p className="text-16 text-gray-600 group-hover:text-gray-800 transition-colors">
                      {elm.address}
                    </p>
                  </div>

                  <div className="flex items-center mb-20 group">
                    <Phone className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 group-hover:text-blue-700 transition-colors" />
                    <a
                      href={`tel:${elm.phone}`}
                      className="text-16 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {elm.phone}
                    </a>
                  </div>

                  <div className="flex items-center mb-20 group">
                    <Mail className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 group-hover:text-blue-700 transition-colors" />
                    <a
                      href={`mailto:${elm.email}`}
                      className="text-16 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {elm.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
