"use client";
import BlogSingle from "@/components/blog/BlogSingle";
import RelatedBlogs from "@/components/blog/RelatedBlogs";
import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import MobailHeader1 from "@/components/headers/MobailHeader1";
import { allBlogs } from "@/data/blogs";
import React, { useState, useEffect } from "react";

export default function Page({ params }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const id = params.slug.split("-").pop(); // ბოლო რიცხვს იღებს URL-დან
  const blog = allBlogs.filter((elm) => elm.id === id)[0] || allBlogs[0];

  return (
    <>
      {isMobile ? <MobailHeader1 /> : <Header5 />}
      <main className="main">
        <BlogSingle blog={blog} />
        {/* <RelatedBlogs /> */}
      </main>
      <Footer1 />
    </>
  );
}
