"use client";
import { languages } from "@/data/languages"; // Ensure this is set up correctly
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Language() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].code);
  const [ddOpen, setDdOpen] = useState(false);

  // Handle language change
  const handleLanguageChange = (code) => {
    setSelectedLanguage(code);
    // Here you would typically handle changing the language using i18next's i18n.changeLanguage method.
    i18n.changeLanguage(code);
    setDdOpen(false);
  };

  useEffect(() => {
    const myDiv = document.getElementById("myDiv");
    const myDiv2 = document.getElementById("myDiv2");

    document.addEventListener("click", function (event) {
      const isClickInside = myDiv.contains(event.target);
      const isClickInside2 = myDiv2.contains(event.target);

      if (!isClickInside && !isClickInside2) {
        setDdOpen(false);
      }
    });
  }, []);

  return (
    <>
      <span
        id="myDiv2"
        onClick={() => setDdOpen((pre) => !pre)}
        className="text-14-medium icon-list icon-account"
      >
        <span className="text-14-medium color-white arrow-down">
          {selectedLanguage}
        </span>
      </span>
      <div
        id="myDiv"
        className={`dropdown-account ${ddOpen ? "dropdown-open" : ""}`}
      >
        <ul>
          {languages.map((elm, i) => (
            <li key={i} onClick={() => handleLanguageChange(elm.code)}>
              <a className="font-md" href="#">
                <Image width={22} height={16} src={elm.image} alt={elm.name} />
                {elm.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
