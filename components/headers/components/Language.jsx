"use client"
import { languages } from "@/data/languages";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/src/i18n/routing";

export default function Language() {
  const router = useRouter();
  const pathname = usePathname();
  const [ddOpen, setDdOpen] = useState(false);

  // Get current language from pathname
  const getCurrentLanguage = () => {
    const firstSegment = pathname.split("/")[1];
    return languages.some((lang) => lang.code === firstSegment)
      ? firstSegment
      : "ka";
  };

  // Function to get path without current language prefix
  const getPathWithoutCurrentLang = (path) => {
    const segments = path.split("/");
    const currentLang = getCurrentLanguage();

    if (segments[1] === currentLang) {
      return "/" + segments.slice(2).join("/");
    }
    return path;
  };

  const handleLanguageChange = async (code) => {
    try {
      // Get path without current language prefix
      const pathWithoutLang = getPathWithoutCurrentLang(pathname);

      // Construct new path with new language code
      const newPath = `/${code}${pathWithoutLang}`;

      // Use router.push to navigate
      await router.push(newPath);

      setDdOpen(false);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  useEffect(() => {
    const myDiv = document.getElementById("myDiv");
    const myDiv2 = document.getElementById("myDiv2");

    const handleClickOutside = (event) => {
      const isClickInside = myDiv?.contains(event.target);
      const isClickInside2 = myDiv2?.contains(event.target);

      if (!isClickInside && !isClickInside2) {
        setDdOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const currentLanguage = getCurrentLanguage();

  return (
    <>
      <span
        id="myDiv2"
        onClick={() => setDdOpen((pre) => !pre)}
        className="text-14-medium icon-list icon-account"
      >
        <span className="text-14-medium color-white arrow-down">
          {currentLanguage.toUpperCase()}
        </span>
      </span>
      <div
        id="myDiv"
        className={`dropdown-account ${ddOpen ? "dropdown-open" : ""}`}
      >
        <ul>
          {languages.map((elm, i) => (
            <li
              key={i}
              onClick={() => handleLanguageChange(elm.code)}
              className={currentLanguage === elm.code ? "active" : ""}
            >
              <a className="font-md cursor-pointer">
                <Image width={18} height={14} src={elm.image} alt={elm.name} />
                {elm.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
