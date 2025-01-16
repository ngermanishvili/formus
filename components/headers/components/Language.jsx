import { languages } from "@/data/languages";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/src/i18n/routing";

export default function Language() {
  const router = useRouter();
  const pathname = usePathname();
  const [ddOpen, setDdOpen] = useState(false);

  // Function to get base path without any language prefixes
  const getBasePath = (path) => {
    // Remove leading and trailing slashes
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Split into segments
    const segments = trimmedPath.split("/");

    // Create array of language codes
    const languageCodes = languages.map((lang) => lang.code);

    // Filter out any segments that match language codes
    const cleanSegments = segments.filter(
      (segment) => !languageCodes.includes(segment)
    );

    // Reconstruct path
    return cleanSegments.length > 0 ? `/${cleanSegments.join("/")}` : "/";
  };

  const handleLanguageChange = async (code) => {
    try {
      // Get base path without any language codes
      const basePath = getBasePath(pathname);

      // Construct new path
      const newPath = code + (basePath === "/" ? "" : basePath);

      // Use router.replace instead of push to avoid adding to history
      await router.replace(`/${newPath}`);

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

  // Get current language from pathname
  const getCurrentLanguage = () => {
    const firstSegment = pathname.split("/")[1];
    return languages.some((lang) => lang.code === firstSegment)
      ? firstSegment
      : "ka";
  };

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
