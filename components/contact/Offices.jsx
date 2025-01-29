import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Offices() {
  const contactCards = [
    {
      city: "თბილისი",
      address: "სულიკო ტორტლაძის ქუჩა, თბილისი, საქართველო",
      phone: "+(995) 593 93 90 93",
      email: "info@formus.ge",
    },
  ];

  return (
    <div className="section pt-60 pb-60 bg-gray-50 w-full">
      <div className="container-sub w-full">
        <div className="row">
          {contactCards.map((elm, i) => (
            <div key={i} className="col-lg-3 col-sm-6 mb-30 w-full">
              <div className="cardContact wow fadeInUp bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="cardInfo">
                  <h6 className="heading-20-medium mb-10 text-gray-800 font-semibold flex items-center">
                    {elm.city} Office
                  </h6>

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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
