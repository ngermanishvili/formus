"use client";

import { useState } from "react";
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
  Building2,
  ArrowLeft,
} from "lucide-react";
import { Label } from "@/components/ui/label";

export default function CreateProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("georgian");
  const [blocks, setBlocks] = useState([{ name: "" }]);
  const [formData, setFormData] = useState({
    title_ge: "",
    title_en: "",
    description_ge: "",
    description_en: "",
    main_image_url: "",
    location_ge: "",
    location_en: "",
    features_ge: JSON.stringify([{ title: "", description: "" }]),
    features_en: JSON.stringify([{ title: "", description: "" }]),
    second_section_img: "",
    second_section_title_en: "",
    second_section_title_ge: "",
    second_section_description_en: "",
    second_section_description_ge: "",
    display_order: "",
    is_active: false,
  });

  const handleUploadSuccess = (result, section) => {
    setFormData((prev) => ({
      ...prev,
      [section === "main" ? "main_image_url" : "second_section_img"]:
        result.info.secure_url,
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

  const handleAddBlock = () => {
    setBlocks([...blocks, { name: "" }]);
  };

  const handleBlockChange = (index, value) => {
    const newBlocks = [...blocks];
    newBlocks[index].name = value;
    setBlocks(newBlocks);
  };

  const handleRemoveBlock = (index) => {
    if (blocks.length > 1) {
      const newBlocks = [...blocks];
      newBlocks.splice(index, 1);
      setBlocks(newBlocks);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create the project
      const projectResponse = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!projectResponse.ok) {
        const data = await projectResponse.json();
        console.error("პროექტის შექმნის შეცდომა:", data.message);
        setLoading(false);
        return;
      }

      const projectData = await projectResponse.json();
      const projectId = projectData.data.id;

      // Now add the blocks
      const validBlocks = blocks.filter((block) => block.name.trim() !== "");

      if (validBlocks.length > 0) {
        for (const block of validBlocks) {
          const blockResponse = await fetch(
            `/api/projects/${projectId}/blocks`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: block.name }),
            }
          );

          if (!blockResponse.ok) {
            console.error(`შეცდომა ბლოკის "${block.name}" დამატებისას`);
          }
        }
      }

      router.push("/admin/dashboard/projects");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ახალი პროექტის დამატება
          </h1>
          <p className="text-gray-500 mt-1">შეავსეთ ინფორმაცია ორივე ენაზე</p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} /> უკან დაბრუნება
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          {/* Main Image Upload */}
          <Card>
            <CardContent className="p-6">
              <Label className="text-base font-semibold mb-4 block">
                მთავარი სურათი
              </Label>
              <CldUploadWidget
                uploadPreset="formus_test"
                onSuccess={(result) => handleUploadSuccess(result, "main")}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open()}
                    className="w-full h-32 border-dashed"
                  >
                    {formData.main_image_url ? (
                      <img
                        src={formData.main_image_url}
                        alt="Main Image Preview"
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
            </CardContent>
          </Card>

          {/* Position Order */}
          <div>
            <Label className="text-base font-semibold mb-4 block">
              პოზიცია (რიგითობა)
            </Label>
            <Input
              type="number"
              placeholder="შეიყვანეთ რიგითობა (1, 2, 3...)"
              value={formData.display_order}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  display_order: e.target.value,
                }))
              }
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              დაბალი რიცხვები გამოჩნდება თავში. თუ ცარიელია, გამოჩნდება ბოლოს.
            </p>
          </div>

          {/* Active Status Toggle */}
          <div>
            <Label className="text-base font-semibold mb-4 block">
              პროექტის აქტიურობა
            </Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active-toggle"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
                className="w-6 h-6"
              />
              <label htmlFor="active-toggle" className="text-sm font-medium">
                {formData.is_active
                  ? "ჩართულია - პროექტს ექნება მისი გვერდი"
                  : "გამორთულია - გამოჩნდება მხოლოდ გალერეაში"}
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              აქტიური პროექტისთვის შეიქმნება დეტალური გვერდი. არააქტიური
              პროექტისთვის გამოჩნდება მხოლოდ სურათი.
            </p>
          </div>

          {/* Project Blocks */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-xl font-semibold">
                  პროექტის ბლოკები
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBlock}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  ბლოკის დამატება
                </Button>
              </div>

              <div className="space-y-3">
                {blocks.map((block, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="ბლოკის სახელი (მაგ: A, B, C...)"
                      value={block.name}
                      onChange={(e) => handleBlockChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBlock(index)}
                      disabled={blocks.length === 1}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-4">
                მიუთითეთ პროექტის სხვადასხვა ბლოკები (მაგ: A, B, C ბლოკი და
                ა.შ.). ბლოკები საჭიროა, რომ შემდგომში ბინები მივაკუთვნოთ
                კონკრეტულ ბლოკს.
              </p>
            </CardContent>
          </Card>

          {/* First Section Content */}
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

          {/* Second Section Content */}
          <Card>
            <CardContent className="p-6">
              <Label className="text-2xl font-semibold mb-6 block">
                მეორე სექცია
              </Label>
              <div className="space-y-8">
                {/* Image Upload */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    სურათი
                  </Label>
                  <CldUploadWidget
                    uploadPreset="formus_test"
                    onSuccess={(result) =>
                      handleUploadSuccess(result, "second")
                    }
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        className="w-full h-32 border-dashed"
                      >
                        {formData.second_section_img ? (
                          <img
                            src={formData.second_section_img}
                            alt="Second Section Preview"
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

                {/* Content Tabs */}
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
                        value={formData.second_section_title_ge}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            second_section_title_ge: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>აღწერა</Label>
                      <Textarea
                        placeholder="შეიყვანეთ აღწერა"
                        value={formData.second_section_description_ge}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            second_section_description_ge: e.target.value,
                          }))
                        }
                        className="min-h-[200px]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="english" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="Enter title"
                        value={formData.second_section_title_en}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            second_section_title_en: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Enter description"
                        value={formData.second_section_description_en}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            second_section_description_en: e.target.value,
                          }))
                        }
                        className="min-h-[200px]"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              გაუქმება
            </Button>
            <Button
              type="submit"
              disabled={loading || !isFormValid()}
              className="min-w-[150px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  იტვირთება...
                </>
              ) : (
                "დამატება"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
