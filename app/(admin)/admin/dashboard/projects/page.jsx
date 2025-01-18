"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.status === "success") {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("გსურთ პროექტის წაშლა?")) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchProjects(); // განაახლე სია
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">პროექტების მართვა</h1>
        <button
          onClick={() => router.push("/admin/dashboard/projects/create")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          პროექტის დამატება
        </button>
      </div>

      {loading ? (
        <div>იტვირთება...</div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {project.title_ge}
                  </h2>
                  <p className="text-gray-600 line-clamp-2">
                    {project.description_ge}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {project.location_ge}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/dashboard/projects/${project.id}/edit`
                      )
                    }
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
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
