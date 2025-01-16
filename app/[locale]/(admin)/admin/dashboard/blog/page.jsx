"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

export default function BlogDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog");
      const data = await response.json();
      if (data.status === "success") {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("გსურთ პოსტის წაშლა?")) {
      try {
        const response = await fetch(`/api/blog/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchPosts(); // განაახლე სია
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ბლოგის მართვა</h1>
        <button
          onClick={() => router.push("/admin/dashboard/blog/create")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          პოსტის დამატება
        </button>
      </div>

      {loading ? (
        <div>იტვირთება...</div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {post.title_en}
                  </h2>
                  <p className="text-gray-600 line-clamp-2">
                    {post.description_en}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/admin/dashboard/blog/${post.id}`)
                    }
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
