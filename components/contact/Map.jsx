import React from "react";

export default function Map() {
  return (
    <div className="section wow fadeInUp">
      <iframe
        className="map-contact h-[400px]"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47668.398555901!2d44.776175740117694!3d41.6930006855846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x404473293bf38e47%3A0x2a01498ef89336b1!2z4YOS4YOa4YOT4YOQ4YOc4YOY!5e0!3m2!1sen!2sge!4v1738152340364!5m2!1sen!2sge"
        style={{ border: "0px" }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
