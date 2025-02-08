// ContactModal.jsx
import React, { useState, useCallback } from "react";

const ContactModal = ({ isOpen, setIsOpen }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [acceptTerms, setAcceptTerms] = useState({
    terms1: false,
    terms2: false,
  });

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        setIsOpen(false);
      }
    },
    [setIsOpen]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (acceptTerms.terms1 && acceptTerms.terms2) {
      setIsSubmitting(true);
      setSubmitMessage({ type: "", text: "" });

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: formData.name,
            phone: formData.phone,
            terms_accepted: acceptTerms.terms1,
            marketing_accepted: acceptTerms.terms2,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitMessage({
            type: "success",
            text: "მონაცემები წარმატებით გაიგზავნა",
          });
          setFormData({ name: "", phone: "" });
          setAcceptTerms({ terms1: false, terms2: false });
          setTimeout(() => setIsOpen(false), 2000);
        } else {
          setSubmitMessage({
            type: "error",
            text: data.error || "დაფიქსირდა შეცდომა",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        setSubmitMessage({ type: "error", text: "დაფიქსირდა შეცდომა" });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-center md:items-end md:justify-end"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#fbb200] rounded-t-2xl sm:rounded-lg w-full max-h-[90vh] sm:h-auto sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] p-4 sm:p-6 relative sm:m-4 md:mr-20 md:mb-24 overflow-y-auto">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-6 mt-1">
          დაგვიტოვეთ ნომერი
        </h2>
        <p className="mb-3 sm:mb-6 text-sm sm:text-base text-gray-600">
          შეავსეთ ფორმა და ჩვენი წარმომადგენელი დაგიკავშირდებათ
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="სახელი"
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="tel"
              placeholder="ტელ. ნომერი"
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2 clear-start w-full">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={acceptTerms.terms1}
                onChange={(e) =>
                  setAcceptTerms({
                    ...acceptTerms,
                    terms1: e.target.checked,
                  })
                }
              />
              <span className="text-xs sm:text-sm text-gray-600 leading-tight">
                გავეცანი და ვეთანხმები, წესებსა & პირობებს
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={acceptTerms.terms2}
                onChange={(e) =>
                  setAcceptTerms({
                    ...acceptTerms,
                    terms2: e.target.checked,
                  })
                }
              />
              <span className="text-xs sm:text-sm text-gray-600 leading-tight">
                გავეცანი მარკეტინგის მიზნით მონაცემთა დამუშავების პირობებს და
                ვეთანხმები
              </span>
            </label>
          </div>

          {submitMessage.text && (
            <div
              className={`p-2.5 sm:p-3 rounded-lg text-center text-sm ${
                submitMessage.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
            disabled={
              !acceptTerms.terms1 || !acceptTerms.terms2 || isSubmitting
            }
          >
            {isSubmitting ? "იგზავნება..." : "გაგზავნა"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
