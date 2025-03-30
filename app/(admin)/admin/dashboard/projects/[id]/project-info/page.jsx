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

export default function ProjectInfoPage({ params }) {
  const router = useRouter();
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
    image_url: "",
    display_order: 0,
    section_type: "feature",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchProjectData();
    fetchProjectInfo();
  }, [params.id]);

  const fetchProjectData = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      const result = await response.json();
      if (result.status === "success") {
        setProjectData(result.data);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  const fetchProjectInfo = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}/info`);
      const result = await response.json();
      if (result.status === "success") {
        setProjectInfo(result.data);
      }
    } catch (error) {
      console.error("Error fetching project info:", error);
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
      image_url: "",
      display_order: projectInfo.length + 1,
      section_type: "feature",
    });
    setSelectedInfo(null);
    setEditMode(false);
  };

  const handleEdit = (info) => {
    setSelectedInfo(info);
    setFormData({
      title_ge: info.title_ge || "",
      title_en: info.title_en || "",
      description_ge: info.description_ge || "",
      description_en: info.description_en || "",
      image_url: info.image_url || "",
      display_order: info.display_order || 0,
      section_type: info.section_type || "feature",
    });
    setEditMode(true);
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
        },
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
      const url = `/api/projects/${params.id}/info`;
      const method = editMode ? "PUT" : "POST";
      const body = editMode
        ? JSON.stringify({ ...formData, infoId: selectedInfo.id })
        : JSON.stringify(formData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (response.ok) {
        fetchProjectInfo();
        resetForm();
      } else {
        const data = await response.json();
        alert(data.message || "ინფორმაციის შენახვისას დაფიქსირდა შეცდომა");
      }
    } catch (error) {
      console.error("Error saving project info:", error);
      alert("ინფორმაციის შენახვისას დაფიქსირდა შეცდომა");
    } finally {
      setSubmitLoading(false);
    }
  };

  const moveItem = async (info, direction) => {
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
        },
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
        },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, section_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="აირჩიეთ სექციის ტიპი" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">მახასიათებელი</SelectItem>
                      <SelectItem value="about_page">
                        აღწერითი გვერდი
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>სურათი</Label>
                  <CldUploadWidget
                    uploadPreset="formus_test"
                    onSuccess={handleUploadSuccess}
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
              </div>

              <div className="space-y-4">
                {projectInfo.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    ინფორმაცია არ არის. დაამატეთ ახალი ინფორმაცია.
                  </div>
                ) : (
                  projectInfo
                    .filter(
                      (info) =>
                        filterType === "all" || info.section_type === filterType
                    )
                    .map((info) => (
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
                                  : "აღწერითი გვერდი"}
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
                                onClick={() => handleEdit(info)}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
