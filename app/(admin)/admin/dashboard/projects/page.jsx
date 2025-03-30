"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Save, ArrowUp, ArrowDown, Info } from "lucide-react";

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPositions, setEditingPositions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.status === "success") {
        // The server already sorts by display_order, but let's ensure consistent order here too
        const sortedProjects = [...data.data].sort((a, b) => {
          // Sort by display_order, null values go to the end
          if (a.display_order === null && b.display_order === null) {
            return new Date(b.created_at) - new Date(a.created_at); // Most recent first for nulls
          }
          if (a.display_order === null) return 1;
          if (b.display_order === null) return -1;
          return a.display_order - b.display_order;
        });

        setProjects(sortedProjects);
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

  const updatePosition = (id, newPosition) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, display_order: newPosition } : project
      )
    );
  };

  const moveUp = (index) => {
    if (index === 0) return;

    const newProjects = [...projects];
    const currentProject = newProjects[index];
    const aboveProject = newProjects[index - 1];

    // Swap display_order values
    const tempOrder = currentProject.display_order;
    newProjects[index].display_order = aboveProject.display_order;
    newProjects[index - 1].display_order = tempOrder;

    // Swap positions in the array
    [newProjects[index], newProjects[index - 1]] = [
      newProjects[index - 1],
      newProjects[index],
    ];

    setProjects(newProjects);
  };

  const moveDown = (index) => {
    if (index === projects.length - 1) return;

    const newProjects = [...projects];
    const currentProject = newProjects[index];
    const belowProject = newProjects[index + 1];

    // Swap display_order values
    const tempOrder = currentProject.display_order;
    newProjects[index].display_order = belowProject.display_order;
    newProjects[index + 1].display_order = tempOrder;

    // Swap positions in the array
    [newProjects[index], newProjects[index + 1]] = [
      newProjects[index + 1],
      newProjects[index],
    ];

    setProjects(newProjects);
  };

  const savePositions = async () => {
    setIsSaving(true);
    try {
      const updates = projects.map((project) => ({
        id: project.id,
        display_order: project.display_order,
      }));

      const response = await fetch("/api/projects/positions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ positions: updates }),
      });

      if (response.ok) {
        setEditingPositions(false);
        fetchProjects();
      } else {
        const data = await response.json();
        alert(data.message || "პოზიციების შენახვისას დაფიქსირდა შეცდომა");
      }
    } catch (error) {
      console.error("Error saving positions:", error);
      alert("პოზიციების შენახვისას დაფიქსირდა შეცდომა");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">პროექტების მართვა</h1>
        <div className="flex gap-3">
          {editingPositions ? (
            <button
              onClick={savePositions}
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              {isSaving ? (
                "ინახება..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  შენახვა
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setEditingPositions(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
            >
              პოზიციების ცვლილება
            </button>
          )}
          <button
            onClick={() => router.push("/admin/dashboard/projects/create")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            პროექტის დამატება
          </button>
        </div>
      </div>

      {loading ? (
        <div>იტვირთება...</div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project, index) => (
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
                  <div className="flex items-center mt-2 gap-2">
                    {editingPositions ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={project.display_order || ""}
                          onChange={(e) =>
                            updatePosition(project.id, e.target.value)
                          }
                          className="w-20 px-2 py-1 border rounded text-sm"
                          min="1"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveDown(index)}
                            disabled={index === projects.length - 1}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                          პოზიცია:{" "}
                          {project.display_order || "არ არის მითითებული"}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs ${
                            project.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          } rounded-md`}
                        >
                          {project.is_active ? "აქტიური" : "არააქტიური"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!editingPositions && (
                    <>
                      <button
                        onClick={() =>
                          router.push(
                            `/admin/dashboard/projects/${project.id}/project-info`
                          )
                        }
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                        title="პროექტის დეტალური ინფორმაცია"
                      >
                        <Info className="w-5 h-5" />
                      </button>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
