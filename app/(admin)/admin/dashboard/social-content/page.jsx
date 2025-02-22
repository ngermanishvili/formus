"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SocialLinksDashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/social-links");
      const data = await response.json();
      if (data.status === "success") {
        setLinks(data.data);
      }
    } catch (error) {
      console.error("Error fetching social links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityToggle = async (
    id,
    currentVisibility,
    currentDisplayOrder
  ) => {
    try {
      const response = await fetch(`/api/social-links/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_visible: !currentVisibility,
          display_order: currentDisplayOrder, // ვინარჩუნებთ არსებულ display_order-ს
        }),
      });
      if (response.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("გსურთ სოციალური ქსელის წაშლა?")) {
      try {
        const response = await fetch(`/api/social-links/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchLinks();
        }
      } catch (error) {
        console.error("Error deleting social link:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">სოციალური ქსელების მართვა</h1>
        <Button
          onClick={() => router.push("/admin/dashboard/social-content/create")}
          className="bg-blue-500 hover:bg-blue-600"
        >
          ლინკის დამატება
        </Button>
      </div>

      {loading ? (
        <div>იტვირთება...</div>
      ) : (
        <div className="grid gap-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{link.platform}</h2>
                <p className="text-gray-600">
                  {link.url || "URL არ არის მითითებული"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleVisibilityToggle(link.id, link.is_visible)
                  }
                  className={
                    link.is_visible ? "text-green-500" : "text-gray-500"
                  }
                >
                  {link.is_visible ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(`/admin/dashboard/social-content/${link.id}`)
                  }
                  className="text-blue-500"
                >
                  <Pencil className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(link.id)}
                  className="text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
