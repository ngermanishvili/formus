import BlogSingle from "@/components/blog/BlogSingle";
import Footer1 from "@/components/footers/Footer1";
import Header5 from "@/components/headers/Header5";
import { allBlogs } from "@/data/blogs";

export default function Page({ params }) {
  const id = params.slug.split("-").pop(); // ბოლო რიცხვს იღებს URL-დან
  const blog = allBlogs.filter((elm) => elm.id === id)[0] || allBlogs[0];

  return (
    <>
      <main className="main">
        <BlogSingle blog={blog} />
        {/* <RelatedBlogs /> */}
      </main>
    </>
  );
}
