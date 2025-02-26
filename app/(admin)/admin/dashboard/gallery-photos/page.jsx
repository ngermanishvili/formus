"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ExternalLink, ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GalleryPhotosDashboard() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async (category = null) => {
    try {
      const url =
        category && category !== "all"
          ? `/api/gallery-photos?category=${category}`
          : "/api/gallery-photos";

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "success") {
        setPhotos(data.data);
      }
    } catch (error) {
      console.error("Error fetching gallery photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setLoading(true);

    if (value === "all") {
      fetchPhotos();
    } else {
      fetchPhotos(value);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("გსურთ გალერეის ფოტოს წაშლა?")) {
      try {
        const response = await fetch(`/api/gallery-photos/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchPhotos(activeTab !== "all" ? activeTab : null);
        }
      } catch (error) {
        console.error("Error deleting gallery photo:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">გალერეის ფოტოების მართვა</h1>
        <Button
          onClick={() => router.push("/admin/dashboard/gallery-photos/create")}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          ფოტოს დამატება
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">ყველა</TabsTrigger>
          <TabsTrigger value="interior">ინტერიერი</TabsTrigger>
          <TabsTrigger value="exterior">ექსტერიერი</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.length > 0 ? (
            photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="relative aspect-video w-full overflow-hidden">
                  {photo.image_path ? (
                    <img
                      src={photo.image_path}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium">
                    {photo.category === "interior" ? "ინტერიერი" : "ექსტერიერი"}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{photo.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {photo.description}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                        <a
                          href={photo.project_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline truncate max-w-[200px]"
                        >
                          {photo.project_link}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          photo.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {photo.is_active ? "აქტიური" : "არააქტიური"}
                      </span>
                      <span className="text-xs text-gray-500">
                        რიგი: {photo.display_order}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/admin/dashboard/gallery-photos/${photo.id}/edit`
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">ფოტოები არ მოიძებნა</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
