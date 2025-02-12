"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LoadingOverlay from "../loader/loader";

export default function BlogSingle() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "ka";

  // Georgian months array
  const georgianMonths = [
    "იანვარი",
    "თებერვალი",
    "მარტი",
    "აპრილი",
    "მაისი",
    "ივნისი",
    "ივლისი",
    "აგვისტო",
    "სექტემბერი",
    "ოქტომბერი",
    "ნოემბერი",
    "დეკემბერი",
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    if (locale === "ka") {
      const month = georgianMonths[d.getMonth()];
      const year = d.getFullYear();
      return `${month}, ${year}`;
    } else {
      return d.toLocaleString("en", {
        month: "long",
        year: "numeric",
      });
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        // Get ID from URL
        const urlParts = pathname.split("-");
        const blogId = urlParts[urlParts.length - 1];

        console.log("Blog ID:", blogId);
        console.log("Full pathname:", pathname);

        const response = await fetch(`/api/blog/${blogId}`);
        const result = await response.json();

        console.log("API Response:", result);

        if (result.status === "success" && result.data) {
          setBlog(result.data);
          setError(null);
        } else {
          setError(result.message || "Could not load blog");
        }
      } catch (error) {
        setError("Error loading blog");
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pathname) {
      fetchBlog();
    }
  }, [pathname]);

  if (loading) {
    return (
      <section className="section pt-60 bg-white latest-new-white">
        <div className="container-sub">
          <LoadingOverlay />
        </div>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="section pt-60 bg-white latest-new-white">
        <div className="container-sub">
          <div className="text-center text-red-500">
            {error || "Blog not found"}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section pt-60 bg-white latest-new-white mt-[50px]">
      <div className="container-sub">
        <div className="box-frature-image mb-60 wow fadeInUp">
          <div className="cardImage">
            <div className="datePost">
              <div className="heading-52-medium color-white">
                {new Date(blog.created_at).getDate()}.
              </div>
              <p className="text-14 color-white">
                {formatDate(blog.created_at)}
              </p>
            </div>
            {blog.image_url && (
              <Image
                src={blog.image_url}
                alt={locale === "ka" ? blog.title_ge : blog.title_en}
                width={1170}
                height={600}
                style={{
                  width: "100%",
                  height: "650px",
                  objectFit: "cover",
                }}
                priority={true}
                quality={75}
              />
            )}
          </div>
        </div>
        <h2 className="heading-44-medium mb-30 wow fadeInUp">
          {locale === "ka" ? blog.title_ge : blog.title_en}
        </h2>
        <div className="content-single wow fadeInUp">
          <p className="color-black">
            {locale === "ka" ? blog.description_ge : blog.description_en}
          </p>
        </div>
      </div>
    </section>
  );
}
