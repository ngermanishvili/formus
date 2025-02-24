"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Pagination from "../common/Pagination";
import LoadingOverlay from "../loader/loader";

export default function Blogs1() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "ka";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/blog");
        const result = await response.json();

        if (result.status === "success" && Array.isArray(result.data)) {
          setBlogs(result.data);
          setError(null);
        } else {
          setError("Could not load blogs");
        }
      } catch (error) {
        setError("Error loading blogs");
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/[^a-zა-ჰ0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const truncateTitle = (title) => {
    if (!title) return "";
    return title.length > 35 ? title.substring(0, 35) + "..." : title;
  };

  if (loading) {
    return (
      <section className="section pt-60 bg-white latest-new-white">
        <div className="container-sub">
          <LoadingOverlay />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section pt-60 bg-white latest-new-white">
        <div className="container-sub">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section pt-60 bg-white latest-new-white">
      <div className="container-sub">
        <div className="row mt-50">
          {blogs.map((blog) => (
            <div key={blog.id} className="col-lg-4">
              <div className="cardNews wow fadeInUp">
                <Link
                  href={`/media-single/${createSlug(
                    locale === "ka" ? blog.title_ge : blog.title_en
                  )}-${blog.id}`}
                >
                  <div
                    className="cardImage"
                    style={{ height: "250px", position: "relative" }}
                  >
                    <div className="datePost">
                      <div className="heading-52-medium color-white">
                        {new Date(blog.created_at).getDate()}.
                      </div>
                      <p className="text-14 color-white">
                        {new Date(blog.created_at).toLocaleString(locale, {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {blog.image_url && (
                      <Image
                        fill
                        src={blog.image_url}
                        alt={locale === "ka" ? blog.title_ge : blog.title_en}
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                  </div>
                </Link>
                <div className="cardInfo">
                  <Link
                    className="color-white"
                    href={`/media-single/${createSlug(
                      locale === "ka" ? blog.title_ge : blog.title_en
                    )}-${blog.id}`}
                  >
                    <h3 className="text-20-medium color-white mb-20">
                      {truncateTitle(
                        locale === "ka" ? blog.title_ge : blog.title_en
                      )}
                    </h3>
                  </Link>
                  <p className="color-white mb-20">
                    {locale === "ka"
                      ? blog.description_ge.split(" ").slice(0, 8).join(" ")
                      : blog.description_en.split(" ").slice(0, 8).join(" ")}
                    ...
                  </p>
                  <Link
                    className="cardLink btn btn-arrow-up flex justify-center items-center"
                    href={`/media-single/${blog.id}`}
                  >
                    <svg
                      className="icon-16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* {blogs.length > 0 && (
          <div className="text-center mt-40 mb-120 wow fadeInUp">
            <nav className="box-pagination">
              <Pagination />
            </nav>
          </div>
        )} */}
      </div>
    </section>
  );
}
