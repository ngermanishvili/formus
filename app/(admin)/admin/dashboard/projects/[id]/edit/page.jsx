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
} from "lucide-react";
import { Label } from "@/components/ui/label";

export default function EditProject({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("georgian");
  const [formData, setFormData] = useState({
    title_ge: "",
    title_en: "",
    description_ge: "",
    description_en: "",
    main_image_url: "",
    location_ge: "",
    location_en: "",
    features_ge: "[]",
    features_en: "[]",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        const result = await response.json();

        if (result.status === "success" && result.data) {
          // მონაცემების მომზადება
          const project = result.data;
          setFormData({
            ...project,
            features_ge:
              typeof project.features_ge === "string"
                ? project.features_ge
                : JSON.stringify(project.features_ge || []),
            features_en:
              typeof project.features_en === "string"
                ? project.features_en
                : JSON.stringify(project.features_en || []),
          });
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const handleUploadSuccess = (result) => {
    setFormData((prev) => ({
      ...prev,
      main_image_url: result.info.secure_url,
    }));
  };

  const handleFeatureChange = (lang, index, field, value) => {
    const features = JSON.parse(formData[`features_${lang}`]);
    features[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      [`features_${lang}`]: JSON.stringify(features),
    }));
  };

  const addFeature = (lang) => {
    const features = JSON.parse(formData[`features_${lang}`]);
    features.push({ title: "", description: "" });
    setFormData((prev) => ({
      ...prev,
      [`features_${lang}`]: JSON.stringify(features),
    }));
  };

  const removeFeature = (lang, index) => {
    const features = JSON.parse(formData[`features_${lang}`]);
    features.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      [`features_${lang}`]: JSON.stringify(features),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/dashboard/projects");
      } else {
        const data = await response.json();
        alert(data.message || "შეცდომა პროექტის განახლებისას");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("შეცდომა პროექტის განახლებისას");
    } finally {
      setSubmitLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title_ge.trim() !== "" &&
      formData.title_en.trim() !== "" &&
      formData.description_ge.trim() !== "" &&
      formData.description_en.trim() !== "" &&
      formData.main_image_url !== ""
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            პროექტის რედაქტირება
          </h1>
          <p className="text-gray-500 mt-1">შეცვალეთ ინფორმაცია ორივე ენაზე</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          {/* Image Upload Section */}
          <Card>
            <CardContent className="p-6">
              <Label className="text-base font-semibold mb-4 block">
                მთავარი სურათი
              </Label>
              <CldUploadWidget
                uploadPreset="formus_test"
                onSuccess={handleUploadSuccess}
              >
                {({ open }) => (
                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => open()}
                      className="w-full h-32 border-dashed"
                    >
                      {formData.main_image_url ? (
                        <img
                          src={formData.main_image_url}
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
                  </div>
                )}
              </CldUploadWidget>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
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
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>მდებარეობა</Label>
                    <Input
                      placeholder="შეიყვანეთ მდებარეობა"
                      value={formData.location_ge}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location_ge: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>მახასიათებლები</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addFeature("ge")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        დამატება
                      </Button>
                    </div>
                    {JSON.parse(formData.features_ge).map((feature, index) => (
                      <div key={index} className="grid gap-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="მახასიათებლის სათაური"
                            value={feature.title}
                            onChange={(e) =>
                              handleFeatureChange(
                                "ge",
                                index,
                                "title",
                                e.target.value
                              )
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature("ge", index)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <Input
                          placeholder="მახასიათებლის აღწერა"
                          value={feature.description}
                          onChange={(e) =>
                            handleFeatureChange(
                              "ge",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
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
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="Enter location"
                      value={formData.location_en}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location_en: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Features</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addFeature("en")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                    {JSON.parse(formData.features_en).map((feature, index) => (
                      <div key={index} className="grid gap-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Feature title"
                            value={feature.title}
                            onChange={(e) =>
                              handleFeatureChange(
                                "en",
                                index,
                                "title",
                                e.target.value
                              )
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFeature("en", index)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Feature description"
                          value={feature.description}
                          onChange={(e) =>
                            handleFeatureChange(
                              "en",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={submitLoading}
            >
              გაუქმება
            </Button>
            <Button
              type="submit"
              disabled={submitLoading || !isFormValid()}
              className="min-w-[150px]"
            >
              {submitLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  იტვირთება...
                </>
              ) : (
                "განახლება"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
