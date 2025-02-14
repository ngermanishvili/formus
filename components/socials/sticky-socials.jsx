// StickySocial.jsx
import React, { useState } from "react";
import { PiMessengerLogoDuotone } from "react-icons/pi";
import { IoLogoWechat } from "react-icons/io5";
import ContactModal from "./contact-modal";

const StickySocial = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-16 sm:bottom-20 md:bottom-24 right-2 sm:right-4 z-50 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FBB200] hover:bg-[#ffcc3f] text-white p-3 sm:p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <IoLogoWechat className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <a
          href="https://www.facebook.com/messages/t/100464459308184"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#ABC188] hover:bg-[##557424 text-white p-3 sm:p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <PiMessengerLogoDuotone className="w-6 h-6 sm:w-8 sm:h-8" />
        </a>
      </div>
      <ContactModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};

export default StickySocial;
