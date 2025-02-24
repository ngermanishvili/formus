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
      <div className="fixed bottom-24 sm:bottom-20 md:bottom-24 right-2 sm:right-4 z-50 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative">
          {showTooltip && (
            <div className="absolute bottom-full mb-2 right-0 bg-[#ABC188] text-black p-2 rounded shadow-md whitespace-nowrap opacity-0 animate-fadeIn transition-all duration-300">
              <div className="text-sm font-medium">დაგვიკავშირდით</div>
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#000]"></div>
            </div>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FBB200] hover:bg-[#ffcc3f] text-white p-3 sm:p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <IoLogoWechat className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#ABC188] hover:bg-[#557424] text-white p-3 sm:p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <PiMessengerLogoDuotone className="w-6 h-6 sm:w-8 sm:h-8" />
        </a>
      </div>
      <ContactModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};

export default StickySocial;
