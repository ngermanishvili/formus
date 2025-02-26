import React, { useState, useEffect } from "react";
import { PiMessengerLogoDuotone } from "react-icons/pi";
import { IoLogoWechat } from "react-icons/io5";
import ContactModal from "./contact-modal";

// Add custom animation for tooltip
const tooltipAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

const StickySocial = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messengerUrl, setMessengerUrl] = useState(
    "https://www.facebook.com/messages/t/100464459308184"
  );
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Check if user is on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      setMessengerUrl("https://m.me/100464459308184");
    }

    // Hide tooltip after 5 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    // Cleanup timer on component unmount
    return () => clearTimeout(tooltipTimer);
  }, []);

  return (
    <>
      <style>{tooltipAnimation}</style>
      <div className="fixed bottom-24 sm:bottom-20 md:bottom-24 right-2 sm:right-4 z-50 flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
        <div className="relative">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FBB200] mt-2 hover:bg-[#ffcc3f] text-white p-3 sm:p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            დაგვიკავშირდით
          </button>
        </div>
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#ABC188] hover:bg-[#557424] text-white flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <PiMessengerLogoDuotone className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
      </div>
      <ContactModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};

export default StickySocial;
