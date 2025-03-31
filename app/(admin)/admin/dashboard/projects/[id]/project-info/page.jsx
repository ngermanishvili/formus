"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ImagePlus,
  Loader2,
  Globe,
  Languages,
  Plus,
  Trash,
  PencilLine,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter as useNextRouter } from "next/navigation";

export default function ProjectInfoPage({ params }) {
  const router = useRouter();
  const nextRouter = useNextRouter();
  const [loading, setLoading] = useState(true);
  const [projectInfo, setProjectInfo] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState("georgian");
  const [editMode, setEditMode] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [formData, setFormData] = useState({
    title_ge: "",
    title_en: "",
    description_ge: "",
    description_en: "",
    subtitle_ge: "",
    subtitle_en: "",
    image_url: "",
    display_order: 0,
    section_type: "feature",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    fetchProjectData();
    fetchProjectInfo();
  }, [params.id]);

  // შევამოწმოთ მიღებული მონაცემები და საჭიროების შემთხვევაში თავიდან სცადოთ
  useEffect(() => {
    if (projectInfo !== null && !Array.isArray(projectInfo)) {
      console.error("projectInfo is not an array:", projectInfo);
      console.log("Trying to fetch project info again...");
      fetchProjectInfo();
    }
  }, [projectInfo]);

  // გალერეის სექციასთან დაკავშირებული ყველა ლოგიკა ერთ ეფექტში
  useEffect(() => {
    if (Array.isArray(projectInfo) && projectInfo.length > 0) {
      console.log("ვამოწმებთ პროექტის ინფორმაციას გალერეის სექციისთვის");

      // გალერეის სექციის ძიება
      const gallerySection = projectInfo.find(
        (section) =>
          section.section_type === "gallery_section" ||
          section.section_type === "gallery" ||
          (section.title && section.title.toLowerCase().includes("gallery")) ||
          (section.title_geo &&
            section.title_geo.toLowerCase().includes("გალერე"))
      );

      console.log("ნაპოვნი გალერეის სექცია:", gallerySection);

      // რედაქტირების რეჟიმის შემოწმება
      if (
        editMode &&
        selectedInfo &&
        (selectedInfo.section_type === "gallery_section" ||
          selectedInfo.section_type === "gallery")
      ) {
        console.log("გალერეის სექციის რედაქტირების რეჟიმი აქტიურია");

        const parsedImages = parseGalleryImages(selectedInfo.image_url);
        console.log(
          "გაპარსული სურათები რედაქტირების რეჟიმისთვის:",
          parsedImages
        );

        if (parsedImages.length > 0) {
          setGalleryImages(parsedImages);
        }
      }
      // სექციის ტიპის გადართვის დამუშავება
      else if (formData.section_type === "gallery_section") {
        if (gallerySection && gallerySection.image_url) {
          const parsedImages = parseGalleryImages(gallerySection.image_url);
          console.log("გაპარსული არსებული გალერეის სურათები:", parsedImages);

          if (parsedImages.length > 0) {
            setGalleryImages(parsedImages);

            // გამოვაჩინოთ გალერეები ფილტრში
            if (filterType === "all") {
              setFilterType("gallery_section");
            }
          }
        } else {
          // ახალი გალერეის შემთხვევაში გავასუფთაოთ მასივი
          console.log("ახალი გალერეის სექცია, ვასუფთავებთ სურათების მასივს");
          setGalleryImages([]);
        }
      }
    }
  }, [projectInfo, editMode, selectedInfo, formData.section_type, filterType]);

  useEffect(() => {
    console.log("galleryImages განახლდა:", galleryImages);
  }, [galleryImages]);

  useEffect(() => {
    fetchProjectInfo();
  }, []);

  useEffect(() => {
    if (
      Array.isArray(projectInfo) &&
      projectInfo.length > 0 &&
      formData.section_type === "gallery_section"
    ) {
      // ვეძებთ არსებულ გალერეის სექციას
      const gallerySection = projectInfo.find(
        (info) => info.section_type === "gallery_section"
      );

      if (gallerySection) {
        console.log("Found existing gallery section on load:", gallerySection);
        console.log("Gallery section image_url:", gallerySection.image_url);

        // პარსინგის ფუნქციის გამოძახება და gallery images მასივის განახლება
        const images = parseGalleryImages(gallerySection.image_url);
        console.log("Parsed gallery images on page load:", images);

        if (images.length > 0) {
          setGalleryImages(images);
          console.log(
            "Initialized galleryImages state with existing images:",
            images
          );
        }
      }
    }
  }, [projectInfo, formData.section_type]);

  useEffect(() => {
    console.log("Component mounted or updated");
    console.log("Initial galleryImages state:", galleryImages);
  }, []);

  useEffect(() => {
    if (
      editMode &&
      selectedInfo &&
      selectedInfo.section_type === "gallery_section"
    ) {
      console.log(
        "Edit mode active for gallery section, parsing images from:",
        selectedInfo.image_url
      );
      const parsedImages = parseGalleryImages(selectedInfo.image_url);
      console.log("Parsed images for edit mode:", parsedImages);

      if (parsedImages.length > 0) {
        console.log("Setting gallery images for edit mode:", parsedImages);
        setGalleryImages(parsedImages);
      }
    } else if (!editMode && formData.section_type === "gallery_section") {
      console.log("New gallery section, clearing images array");
      setGalleryImages([]);
    }
  }, [selectedInfo, editMode, formData.section_type]);

  useEffect(() => {
    if (editMode && selectedInfo && selectedInfo.section_type === "gallery") {
      console.log(
        "Edit mode active for gallery section, parsing images from:",
        selectedInfo.image_url
      );
      const parsedImages = parseGalleryImages(selectedInfo.image_url);
      console.log("Parsed images for edit mode:", parsedImages);

      if (parsedImages.length > 0) {
        console.log("Setting gallery images for edit mode:", parsedImages);
        setGalleryImages(parsedImages);
      }
    }
  }, [selectedInfo, editMode]);

  const fetchProjectData = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const result = await response.json();
      if (result.status === "success") {
        setProjectData(result.data);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  const navigate = (path) => {
    nextRouter.push(path);
  };

  const fetchProjectInfo = async () => {
    try {
      setLoading(true);
      // გამოვიყენოთ ყველა cache busting პარამეტრი
      const timestamp = new Date().getTime();
      const response = await fetch(
        `/api/projects/${params.id}/info?_=${timestamp}`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project info");
      }

      const data = await response.json();
      console.log("Fetched project info:", data);

      // შევამოწმოთ არის თუ არა მიღებული მონაცემები მასივი
      if (Array.isArray(data)) {
        setProjectInfo(data);
      } else if (data && Array.isArray(data.data)) {
        // თუ API აბრუნებს {data: [...]} ფორმატით
        setProjectInfo(data.data);
        console.log("Using data.data array from API response");
      } else {
        console.error("API did not return an array:", data);
        setProjectInfo([]);
      }

      if (activeTab === "info") {
        nextRouter.refresh(); // გვერდის განახლება
      }
    } catch (error) {
      console.error("Error fetching project info:", error);
      setProjectInfo([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (result) => {
    setFormData((prev) => ({
      ...prev,
      image_url: result.info.secure_url,
    }));
  };

  const resetForm = () => {
    setFormData({
      title_ge: "",
      title_en: "",
      description_ge: "",
      description_en: "",
      subtitle_ge: "",
      subtitle_en: "",
      image_url: "",
      display_order: projectInfo.length + 1,
      section_type: "feature",
    });
    setSelectedInfo(null);
    setEditMode(false);
  };

  const handleEditInfo = (info) => {
    console.log("Editing info:", info);
    setSelectedInfo(info);
    setEditMode(true);

    // ფორმის ველების განახლება
    setFormData({
      title_ge: info.title_ge || "",
      title_en: info.title_en || "",
      description_ge: info.description_ge || "",
      description_en: info.description_en || "",
      subtitle_ge: info.subtitle_ge || "",
      subtitle_en: info.subtitle_en || "",
      section_type: info.section_type || "feature",
      image_url: info.image_url || "",
      display_order: info.display_order || 0,
    });

    // თუ ეს გალერეის სექციაა, ვცდილობთ გავაანალიზოთ image_url როგორც JSON მასივი
    if (info.section_type === "gallery_section" && info.image_url) {
      console.log(
        "Gallery section detected, parsing image_url:",
        info.image_url
      );
      try {
        let imageUrls;
        if (typeof info.image_url === "string") {
          if (
            info.image_url.trim().startsWith("[") &&
            info.image_url.trim().endsWith("]")
          ) {
            // JSON მასივის პარსინგი
            imageUrls = JSON.parse(info.image_url);
            console.log(
              "Successfully parsed image_url as JSON array:",
              imageUrls
            );
          } else if (info.image_url.includes("http")) {
            // ერთი URL-ის შემთხვევაში მასივში გახვევა
            imageUrls = [info.image_url];
            console.log("Single URL detected, wrapping in array:", imageUrls);
          }
        }

        if (Array.isArray(imageUrls)) {
          // განვასუფთაოთ URL-ები
          const cleanUrls = imageUrls
            .map((url) =>
              typeof url === "string" ? url.replace(/['"]/g, "") : ""
            )
            .filter((url) => url.trim() !== "");

          setGalleryImages(cleanUrls);
          console.log("Set galleryImages for editing:", cleanUrls);
        }
      } catch (error) {
        console.error("Error parsing gallery images for edit:", error);
        alert("გალერეის სურათების ჩატვირთვისას დაფიქსირდა შეცდომა");
      }
    }

    // გადავსქროლოთ ფორმასთან
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (infoId) => {
    if (!window.confirm("ნამდვილად გსურთ ამ ინფორმაციის წაშლა?")) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${params.id}/info`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        body: JSON.stringify({ infoId }),
      });

      if (response.ok) {
        fetchProjectInfo();
        resetForm();
      } else {
        const data = await response.json();
        alert(data.message || "ინფორმაციის წაშლისას დაფიქსირდა შეცდომა");
      }
    } catch (error) {
      console.error("Error deleting project info:", error);
      alert("ინფორმაციის წაშლისას დაფიქსირდა შეცდომა");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      let finalFormData = { ...formData };

      if (formData.section_type === "gallery_section") {
        const galleryJson = prepareGalleryImages();
        finalFormData.image_url = galleryJson;
        console.log("Final form data for gallery:", finalFormData);
        console.log("Gallery JSON length:", galleryJson.length);

        // შევამოწმოთ ცარიელია თუ არა
        if (!galleryJson || galleryJson === '""' || galleryJson === "[]") {
          alert("გთხოვთ დაამატოთ მინიმუმ ერთი სურათი გალერეაში");
          setSubmitLoading(false);
          return;
        }
      }

      const url = `/api/projects/${params.id}/info`;
      const method = editMode ? "PUT" : "POST";
      const body = editMode
        ? JSON.stringify({ ...finalFormData, infoId: selectedInfo.id })
        : JSON.stringify(finalFormData);

      console.log("Sending API request:", {
        url,
        method,
        body,
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        body,
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (response.ok) {
        alert(
          editMode
            ? "ინფორმაცია წარმატებით განახლდა!"
            : "ინფორმაცია წარმატებით დაემატა!"
        );
        fetchProjectInfo();
        resetForm();
      } else {
        alert(
          responseData.message || "ინფორმაციის შენახვისას დაფიქსირდა შეცდომა"
        );
      }
    } catch (error) {
      console.error("Error saving project info:", error);
      alert("ინფორმაციის შენახვისას დაფიქსირდა შეცდომა");
    } finally {
      setSubmitLoading(false);
    }
  };

  const moveItem = async (info, direction) => {
    if (!Array.isArray(projectInfo)) {
      console.error("projectInfo is not an array, cannot move items");
      return;
    }

    const currentIndex = projectInfo.findIndex((item) => item.id === info.id);

    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === projectInfo.length - 1)
    ) {
      return;
    }

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetInfo = projectInfo[targetIndex];

    try {
      // Update current item with target's display_order
      await fetch(`/api/projects/${params.id}/info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        body: JSON.stringify({
          infoId: info.id,
          ...info,
          display_order: targetInfo.display_order,
        }),
      });

      // Update target item with current's display_order
      await fetch(`/api/projects/${params.id}/info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        body: JSON.stringify({
          infoId: targetInfo.id,
          ...targetInfo,
          display_order: info.display_order,
        }),
      });

      fetchProjectInfo();
    } catch (error) {
      console.error("Error reordering items:", error);
      alert("პოზიციის ცვლილებისას დაფიქსირდა შეცდომა");
    }
  };

  const isFormValid = () => {
    return (
      formData.title_ge.trim() !== "" && formData.description_ge.trim() !== ""
    );
  };

  const debugState = () => {
    console.group("🔍 დებაგის ინფორმაცია");
    console.log("პროექტის ID:", params.id);
    console.log("გალერეის სურათების მასივი:", galleryImages);
    console.log("გალერეის სურათების რაოდენობა:", galleryImages.length);
    console.log("projectInfo არის მასივი:", Array.isArray(projectInfo));

    try {
      const jsonString = JSON.stringify(galleryImages);
      console.log("გალერეის JSON სტრინგი:", jsonString);
      console.log("JSON სტრინგის სიგრძე:", jsonString.length);

      // შევამოწმოთ პარსინგი
      const parsedBack = JSON.parse(jsonString);
      console.log("უკან პარსინგის შედეგი:", parsedBack);
      console.log(
        "სწორად დაპარსდა:",
        Array.isArray(parsedBack) && parsedBack.length === galleryImages.length
      );
    } catch (e) {
      console.error("JSON დამუშავების შეცდომა:", e);
    }

    console.log("მიმდინარე ფორმის მონაცემები:", formData);
    console.groupEnd();

    return true;
  };

  const prepareGalleryImages = () => {
    if (galleryImages.length > 0) {
      // ვარწმუნებთ, რომ ყველა URL სუფთაა
      const cleanedUrls = galleryImages
        .map((url) => (typeof url === "string" ? url.replace(/['"]/g, "") : ""))
        .filter((url) => url.trim() !== "");

      console.log("Preparing gallery images for save:", cleanedUrls);

      // ვამოწმებთ სურათების მასივს
      if (cleanedUrls.length === 0) {
        console.warn("No valid image URLs to save");
        return "";
      }

      const jsonString = JSON.stringify(cleanedUrls);
      console.log("JSON string for gallery images:", jsonString);
      return jsonString;
    }
    return "";
  };

  const addGalleryImage = (url) => {
    console.log("addGalleryImage called with URL:", url);
    console.log("Current galleryImages before adding:", [...galleryImages]);

    // შევამოწმოთ, არის თუ არა url უკვე მასივში
    const imageExists = galleryImages.some(
      (existingUrl) =>
        existingUrl === url ||
        existingUrl.replace(/['"]/g, "") === url.replace(/['"]/g, "")
    );

    if (!imageExists) {
      const cleanUrl = url.replace(/['"]/g, "");
      console.log("Adding new image to gallery (clean URL):", cleanUrl);

      try {
        new URL(cleanUrl);
        // ვქმნით ახალ მასივს, რომელიც შეიცავს ყველა არსებულ სურათს და ახალს
        const newGalleryImages = [...galleryImages, cleanUrl];
        console.log(
          "New gallery images array (before setState):",
          newGalleryImages
        );

        // ვიყენებთ ფუნქციონალურ მიდგომას setState-ში უკეთესი პრედიქტაბილურობისთვის
        setGalleryImages((prevImages) => {
          const updatedImages = [...prevImages, cleanUrl];
          console.log("Setting state with updated images:", updatedImages);
          return updatedImages;
        });

        // დროის გასვლის შემდეგ შევამოწმოთ, განახლდა თუ არა სახელმწიფო
        setTimeout(() => {
          console.log(
            "Gallery images after state update (timeout):",
            galleryImages
          );
        }, 100);
      } catch (e) {
        console.error("Invalid URL format:", cleanUrl, e);
        alert("URL-ის არასწორი ფორმატი. გთხოვთ, სცადოთ თავიდან.");
      }
    } else {
      console.log("Image URL already exists in gallery, skipping:", url);
      alert("ეს სურათი უკვე დამატებულია გალერეაში.");
    }
  };

  // დავამატოთ ფუნქციები ფოტოების მართვისთვის
  const removeGalleryImage = (indexToRemove) => {
    setGalleryImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const replaceGalleryImage = (indexToReplace) => {
    // ფოტოს ჩანაცვლების ინდექსის შენახვა
    window.replacePhotoIndex = indexToReplace;

    // ვაჩვენოთ შეტყობინება
    alert(`აირჩიეთ ახალი სურათი ფოტო #${indexToReplace + 1}-ის ჩასანაცვლებლად`);
  };

  // გამოსახულებების გაპარსვის ფუნქცია
  const parseGalleryImages = (imageUrl) => {
    console.log("Parsing gallery images from:", imageUrl);
    if (!imageUrl) {
      console.log("No image URL provided");
      return [];
    }

    try {
      // თუ დაშვებულია რომ imageUrl არის მასივი
      if (Array.isArray(imageUrl)) {
        console.log("Image URL is already an array:", imageUrl);
        return imageUrl
          .map((url) =>
            typeof url === "string" ? url.replace(/['"]/g, "") : ""
          )
          .filter((url) => url.trim() !== "");
      }

      // გადმოცემული მნიშვნელობის გასუფთავება
      let cleanJsonString =
        typeof imageUrl === "string"
          ? imageUrl.replace(/^["'](.*)["']$/, "$1").trim()
          : "";

      console.log("Cleaned JSON string:", cleanJsonString);

      if (!cleanJsonString) {
        console.log("Empty string after cleaning");
        return [];
      }

      // მცდელობა JSON მასივის პარსინგის
      if (cleanJsonString.startsWith("[") && cleanJsonString.endsWith("]")) {
        console.log("String appears to be a JSON array, attempting to parse");
        try {
          const parsed = JSON.parse(cleanJsonString);
          console.log("Successfully parsed JSON array:", parsed);

          if (Array.isArray(parsed)) {
            const validUrls = parsed
              .map((url) =>
                typeof url === "string" ? url.replace(/['"]/g, "") : ""
              )
              .filter((url) => url.trim() !== "");

            console.log("Validated URLs from JSON array:", validUrls);
            return validUrls;
          } else {
            console.log("Parsed result is not an array:", parsed);
          }
        } catch (parseError) {
          console.error("JSON parsing error:", parseError);
          // თუ JSON პარსინგი ვერ მოხერხდა, ცადეთ სხვა მეთოდები
        }
      }

      // ცადეთ URL-ების მოძებნა სტრინგში
      if (cleanJsonString.includes("http")) {
        console.log("String contains URLs, attempting to extract them");
        const urlRegex = /(https?:\/\/[^"'\s,\[\]]+)/g;
        const matches = cleanJsonString.match(urlRegex);

        if (matches && matches.length > 0) {
          console.log("Found URLs with regex:", matches);
          return matches
            .map((url) => url.replace(/['"]/g, ""))
            .filter((url) => url.trim() !== "");
        }
      }

      // თუ ერთი URL-ია
      if (cleanJsonString.startsWith("http")) {
        console.log("String appears to be a single URL");
        return [cleanJsonString.replace(/['"]/g, "")];
      }

      console.log("Could not parse gallery images using any method");
    } catch (e) {
      console.error("Error parsing gallery images:", e);
    }

    console.log("Returning empty array as fallback");
    return [];
  };

  const handleSectionTypeChange = (value) => {
    console.log("Section type changed to:", value);

    // ფორმის სექციის ტიპის განახლება
    setFormData((prev) => ({ ...prev, section_type: value }));

    // თუ ირჩევენ გალერეის სექციას, ვცდილობთ ვიპოვოთ არსებული გალერეა
    if (
      value === "gallery_section" &&
      Array.isArray(projectInfo) &&
      projectInfo.length > 0
    ) {
      const gallerySection = projectInfo.find(
        (info) => info.section_type === "gallery_section"
      );

      if (gallerySection) {
        console.log(
          "Found existing gallery section when changing type:",
          gallerySection
        );

        // პარსინგის ფუნქციის გამოძახება და gallery images მასივის განახლება
        const images = parseGalleryImages(gallerySection.image_url);
        console.log("Parsed gallery images on type change:", images);

        if (images.length > 0) {
          setGalleryImages(images);
          console.log("Set galleryImages state with existing images:", images);
        }
      } else {
        // თუ გალერეის სექცია არ არსებობს, გავასუფთაოთ მასივი
        setGalleryImages([]);
        console.log(
          "No existing gallery section found, cleared gallery images"
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  console.log("Rendering component with projectInfo:", projectInfo);
  console.log("Filter type:", filterType);

  // Filter visible items based on filter type
  const visibleItems = Array.isArray(projectInfo)
    ? projectInfo.filter(
        (info) => filterType === "all" || info.section_type === filterType
      )
    : [];

  console.log("Visible items after filtering:", visibleItems);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            პროექტის ინფორმაცია: {projectData?.title_ge}
          </h1>
          <p className="text-gray-500 mt-1">
            დაამატეთ ან შეცვალეთ პროექტის დეტალური ინფორმაცია
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchProjectInfo}
            className="flex gap-2 items-center"
          >
            <Loader2 className="h-4 w-4" />
            განახლება
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            უკან დაბრუნება
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editMode
                  ? "ინფორმაციის რედაქტირება"
                  : "ახალი ინფორმაციის დამატება"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section Type */}
                <div className="space-y-2">
                  <Label>სექციის ტიპი</Label>
                  <Select
                    value={formData.section_type}
                    onValueChange={(value) => {
                      handleSectionTypeChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="აირჩიეთ სექციის ტიპი" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">მახასიათებელი</SelectItem>
                      <SelectItem value="about_page">
                        აღწერითი გვერდი
                      </SelectItem>
                      <SelectItem value="gallery_section">გალერეა</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>სურათი</Label>
                  <CldUploadWidget
                    uploadPreset="formus_test"
                    options={{
                      multiple: false,
                      sources: ["local", "url"],
                      showAdvancedOptions: false,
                      cropping: false,
                      styles: {
                        palette: {
                          window: "#FFFFFF",
                          windowBorder: "#90A0B3",
                          tabIcon: "#0078FF",
                          menuIcons: "#5A616A",
                          textDark: "#000000",
                          textLight: "#FFFFFF",
                          link: "#0078FF",
                          action: "#FF620C",
                          inactiveTabIcon: "#0E2F5A",
                          error: "#F44235",
                          inProgress: "#0078FF",
                          complete: "#20B832",
                          sourceBg: "#f4f4f5",
                        },
                        fonts: {
                          default: null,
                          "'Fira Sans', sans-serif": {
                            url: "https://fonts.googleapis.com/css?family=Fira+Sans",
                            active: true,
                          },
                        },
                      },
                    }}
                    onSuccess={(result) => {
                      if (result && result.info && result.info.secure_url) {
                        const imageUrl = result.info.secure_url;
                        console.log("Upload success, raw URL:", imageUrl);
                        console.log(
                          "Current gallery images before adding:",
                          galleryImages
                        );

                        const cleanUrl = imageUrl.replace(/['"]/g, "");

                        // ვამოწმებთ გვაქვს თუ არა ფოტოს ჩანაცვლების რეჟიმი
                        if (window.replacePhotoIndex !== undefined) {
                          const replaceIndex = window.replacePhotoIndex;

                          setGalleryImages((prevImages) => {
                            const newImages = [...prevImages];
                            newImages[replaceIndex] = cleanUrl;

                            // ვაჩვენოთ შეტყობინება წარმატების შესახებ
                            setTimeout(() => {
                              alert(
                                `ფოტო #${
                                  replaceIndex + 1
                                } წარმატებით შეიცვალა ახლით.`
                              );
                            }, 100);

                            // გავასუფთაოთ ჩანაცვლების რეჟიმი
                            window.replacePhotoIndex = undefined;

                            return newImages;
                          });
                        } else {
                          // ჩვეულებრივი დამატება
                          setGalleryImages((prevImages) => {
                            if (prevImages.includes(cleanUrl)) {
                              alert("ეს სურათი უკვე დამატებულია გალერეაში.");
                              return prevImages;
                            }

                            if (prevImages.length >= 4) {
                              alert(
                                "მაქსიმუმ 4 ფოტოს დამატებაა შესაძლებელი. წაშალეთ რომელიმე არსებული ფოტო ახლის დასამატებლად."
                              );
                              return prevImages;
                            }

                            const newImages = [...prevImages, cleanUrl];
                            console.log(
                              "New gallery images after adding:",
                              newImages
                            );

                            setTimeout(() => {
                              alert(
                                `ფოტო წარმატებით დაემატა. ამჟამად ${newImages.length} სურათია გალერეაში. შეგიძლიათ დაამატოთ კიდევ (მაქსიმუმ 4).`
                              );
                            }, 100);

                            return newImages;
                          });
                        }
                      } else {
                        console.error(
                          "Upload result format unexpected:",
                          result
                        );
                        alert(
                          "სურათის ატვირთვა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან."
                        );
                      }
                    }}
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        className="w-full h-32 border-dashed"
                      >
                        {formData.image_url ? (
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <ImagePlus className="h-8 w-8 mb-2 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              აირჩიეთ ან ჩააგდეთ სურათი
                            </span>
                          </div>
                        )}
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>

                {/* Display Order */}
                <div className="space-y-2">
                  <Label>პოზიცია (რიგითობა)</Label>
                  <Input
                    type="number"
                    placeholder="შეიყვანეთ რიგითობა"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        display_order: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger
                      value="georgian"
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      ქართული
                    </TabsTrigger>
                    <TabsTrigger
                      value="english"
                      className="flex items-center gap-2"
                    >
                      <Languages className="h-4 w-4" />
                      English
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="georgian" className="space-y-4">
                    <div className="space-y-2">
                      <Label>სათაური</Label>
                      <Input
                        placeholder="შეიყვანეთ სათაური"
                        value={formData.title_ge}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title_ge: e.target.value,
                          }))
                        }
                      />
                    </div>
                    {formData.section_type === "about_page" && (
                      <div className="space-y-2">
                        <Label>
                          ქვესათაური (მაგ: დაფინანსებულია "თიბისი" ბანკის მიერ)
                        </Label>
                        <Input
                          placeholder="შეიყვანეთ ქვესათაური"
                          value={formData.subtitle_ge}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              subtitle_ge: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>აღწერა</Label>
                      <Textarea
                        placeholder="შეიყვანეთ აღწერა"
                        value={formData.description_ge}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description_ge: e.target.value,
                          }))
                        }
                        className="min-h-[150px]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="english" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="Enter title"
                        value={formData.title_en}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title_en: e.target.value,
                          }))
                        }
                      />
                    </div>
                    {formData.section_type === "about_page" && (
                      <div className="space-y-2">
                        <Label>Subtitle (e.g.: Financed by TBC Bank)</Label>
                        <Input
                          placeholder="Enter subtitle"
                          value={formData.subtitle_en}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              subtitle_en: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Enter description"
                        value={formData.description_en}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description_en: e.target.value,
                          }))
                        }
                        className="min-h-[150px]"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Buttons */}
                <div className="flex gap-2">
                  {editMode && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={submitLoading}
                    >
                      გაუქმება
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={submitLoading || !isFormValid()}
                    className="flex-1"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ინახება...
                      </>
                    ) : editMode ? (
                      "განახლება"
                    ) : (
                      "დამატება"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info List Section */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                პროექტის ინფორმაციის სია
              </h2>

              <div className="flex gap-2 mb-4">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  onClick={() => setFilterType("all")}
                >
                  ყველა
                </Button>
                <Button
                  variant={filterType === "feature" ? "default" : "outline"}
                  onClick={() => setFilterType("feature")}
                >
                  მახასიათებლები
                </Button>
                <Button
                  variant={filterType === "about_page" ? "default" : "outline"}
                  onClick={() => setFilterType("about_page")}
                >
                  აღწერითი გვერდი
                </Button>
                <Button
                  variant={
                    filterType === "gallery_section" ? "default" : "outline"
                  }
                  onClick={() => setFilterType("gallery_section")}
                >
                  გალერეა
                </Button>
              </div>

              <div className="space-y-4">
                {!Array.isArray(projectInfo) || projectInfo.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    ინფორმაცია არ არის. დაამატეთ ახალი ინფორმაცია.
                  </div>
                ) : visibleItems.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    ამ ფილტრით ინფორმაცია არ არის. შეცვალეთ ფილტრი ან დაამატეთ
                    ახალი ინფორმაცია.
                  </div>
                ) : (
                  visibleItems.map((info) => (
                    <div
                      key={info.id}
                      className="border rounded-lg p-4 shadow-sm flex gap-4"
                    >
                      {info.image_url && (
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
                          <img
                            src={info.image_url}
                            alt={info.title_ge}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate">
                              {info.title_ge}
                            </h3>
                            <p className="text-sm text-gray-500">
                              #{info.display_order} •{" "}
                              {info.section_type === "feature"
                                ? "მახასიათებელი"
                                : info.section_type === "about_page"
                                ? "აღწერითი გვერდი"
                                : info.section_type === "gallery_section"
                                ? "გალერეა"
                                : info.section_type}
                              {info.section_type === "gallery_section" && (
                                <span className="ml-1 text-blue-500 font-medium">
                                  ({parseGalleryImages(info.image_url).length}{" "}
                                  ფოტო)
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveItem(info, "up")}
                              className="h-8 w-8"
                              title="აწევა"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveItem(info, "down")}
                              className="h-8 w-8"
                              title="ჩამოწევა"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditInfo(info)}
                              className="h-8 w-8 text-blue-500"
                              title="რედაქტირება"
                            >
                              <PencilLine className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(info.id)}
                              className="h-8 w-8 text-red-500"
                              title="წაშლა"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {info.description_ge}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Debug panel */}
              <div className="bg-gray-100 p-3 rounded mt-4 border border-gray-300">
                <h3 className="font-semibold mb-2 text-sm">დებაგის პანელი</h3>
                <div className="text-xs">
                  <p className="flex justify-between">
                    <span>სურათების რაოდენობა:</span>
                    <span className="font-bold text-blue-700">
                      {galleryImages.length}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>სურათების მასივი სწორია:</span>
                    <span
                      className={
                        Array.isArray(galleryImages)
                          ? "font-bold text-green-600"
                          : "font-bold text-red-600"
                      }
                    >
                      {Array.isArray(galleryImages) ? "✅ დიახ" : "❌ არა"}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>სექციის ტიპი:</span>
                    <span className="font-bold">{formData.section_type}</span>
                  </p>

                  <div className="mt-3 bg-gray-200 p-2 rounded">
                    <p className="font-semibold mb-1">სურათების მასივი:</p>
                    <pre className="bg-white p-1 rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(galleryImages, null, 2)}
                    </pre>
                  </div>

                  <details className="mt-2" open>
                    <summary className="cursor-pointer hover:text-blue-500 font-semibold">
                      სურათების მართვა ({galleryImages.length}/4)
                    </summary>
                    <ol className="mt-1 ml-3 list-decimal">
                      {galleryImages.map((url, index) => (
                        <li
                          key={index}
                          className="break-all mb-2 bg-white p-2 rounded border"
                        >
                          <div className="flex items-start">
                            <div className="mr-2 w-16 h-16 flex-shrink-0">
                              <img
                                src={url}
                                alt={`სურათი ${index + 1}`}
                                className="w-full h-full object-cover rounded"
                              />
                              <div className="text-xs font-bold text-center bg-gray-200 rounded-b -mt-0.5">
                                #{index + 1}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-600 truncate">
                                {url.substring(0, 40)}...
                              </div>
                              <div className="flex mt-1 gap-1">
                                <button
                                  type="button"
                                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-1 py-0.5 rounded text-xs transition-colors"
                                  onClick={() =>
                                    navigator.clipboard.writeText(url)
                                  }
                                  title="URL-ის კოპირება"
                                >
                                  კოპირება
                                </button>
                                <button
                                  type="button"
                                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-1 py-0.5 rounded text-xs transition-colors"
                                  onClick={() => replaceGalleryImage(index)}
                                  title="ფოტოს ჩანაცვლება"
                                >
                                  ჩანაცვლება
                                </button>
                                <button
                                  type="button"
                                  className="bg-red-100 hover:bg-red-200 text-red-800 px-1 py-0.5 rounded text-xs transition-colors"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `ნამდვილად გსურთ #${
                                          index + 1
                                        } ფოტოს წაშლა?`
                                      )
                                    ) {
                                      removeGalleryImage(index);
                                    }
                                  }}
                                  title="ფოტოს წაშლა"
                                >
                                  წაშლა
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                    {galleryImages.length === 0 && (
                      <div className="text-center py-3 text-gray-500 bg-gray-100 rounded mt-2">
                        გალერეაში ფოტოები არ არის დამატებული
                      </div>
                    )}
                  </details>

                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs transition-colors"
                      onClick={debugState}
                    >
                      დებაგი კონსოლში
                    </button>
                    <button
                      type="button"
                      className="bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded text-xs transition-colors"
                      onClick={() => {
                        // ვეძებთ გალერეის სექციას პროექტის ინფორმაციის სიაში
                        const gallerySection = projectInfo.find(
                          (info) => info.section_type === "gallery_section"
                        );

                        if (gallerySection) {
                          console.log(
                            "Manually loading gallery section:",
                            gallerySection
                          );
                          // პარსინგის მცდელობა
                          const images = parseGalleryImages(
                            gallerySection.image_url
                          );
                          console.log("Parsed gallery images:", images);

                          if (images.length > 0) {
                            setGalleryImages(images);
                            alert(
                              `ფოტოები ჩაიტვირთა! ნაპოვნია ${images.length} ფოტო.`
                            );
                          } else {
                            alert(
                              "ვერ მოხერხდა ფოტოების ჩატვირთვა. გთხოვთ, სცადოთ ფოტოების ხელახლა ატვირთვა."
                            );
                          }
                        } else {
                          alert(
                            "გალერეის სექცია ვერ მოიძებნა. გთხოვთ, შექმნათ ახალი სექცია ტიპით 'გალერეა'."
                          );
                        }
                      }}
                    >
                      ფოტოების ჩატვირთვა
                    </button>
                    <button
                      type="button"
                      className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs transition-colors"
                      onClick={() => {
                        const testImage =
                          "https://res.cloudinary.com/formus/image/upload/v1/samples/landscapes/nature-mountains";
                        console.log("Adding test image:", testImage);
                        setGalleryImages((prev) => [...prev, testImage]);
                      }}
                    >
                      სატესტო სურათის დამატება
                    </button>
                    <button
                      type="button"
                      className="bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded text-xs transition-colors"
                      onClick={() => {
                        if (confirm("ნამდვილად გსურთ ყველა სურათის წაშლა?")) {
                          setGalleryImages([]);
                        }
                      }}
                    >
                      ყველას წაშლა
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
