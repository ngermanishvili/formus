"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ImagePlus, Loader2, Link as LinkIcon, ArrowLeft } from "lucide-react";

export default function CreateGalleryPhoto() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_path: "",
    project_link: "",
    category: "interior", // Default value
    display_order: 0,
    is_active: true,
  });

  const handleUploadSuccess = (result) => {
    setFormData((prev) => ({
      ...prev,
      image_path: result.info.secure_url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/gallery-photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/dashboard/gallery-photos");
      } else {
        const data = await response.json();
        alert(data.message || "შეცდომა ფოტოს დამატებისას");
      }
    } catch (error) {
      console.error("Error creating gallery photo:", error);
      alert("შეცდომა ფოტოს დამატებისას");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.image_path !== "" &&
      formData.project_link !== ""
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            გალერეის ფოტოს დამატება
          </h1>
          <p className="text-gray-500 mt-1">
            შეავსეთ ფორმა ახალი ფოტოს დასამატებლად
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          {/* Image Upload */}
          <Card>
            <CardContent className="p-6">
              <Label className="text-base font-semibold mb-4 block">ფოტო</Label>
              <CldUploadWidget
                uploadPreset="formus_test"
                onSuccess={handleUploadSuccess}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open()}
                    className="w-full h-64 border-dashed"
                  >
                    {formData.image_path ? (
                      <img
                        src={formData.image_path}
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
            </CardContent>
          </Card>

          {/* Content Details */}
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">სათაური</Label>
                <Input
                  id="title"
                  placeholder="შეიყვანეთ სათაური"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">აღწერა (არასავალდებულო)</Label>
                <Textarea
                  id="description"
                  placeholder="შეიყვანეთ აღწერა"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="min-h-[100px]"
                />
              </div>

              {/* Project Link */}
              <div className="space-y-2">
                <Label
                  htmlFor="project_link"
                  className="flex items-center gap-1"
                >
                  <LinkIcon className="h-4 w-4" />
                  პროექტის ბმული
                </Label>
                <Input
                  id="project_link"
                  placeholder="შეიყვანეთ პროექტის ბმული"
                  value={formData.project_link}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      project_link: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-gray-500">
                  მიუთითეთ პროექტის ბმული, რომელზეც გადავა მომხმარებელი ფოტოზე
                  დაჭერისას
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>კატეგორია</Label>
                <RadioGroup
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interior" id="interior" />
                    <Label htmlFor="interior" className="cursor-pointer">
                      ინტერიერი
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exterior" id="exterior" />
                    <Label htmlFor="exterior" className="cursor-pointer">
                      ექსტერიერი
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <Label htmlFor="display_order">ჩვენების რიგითობა</Label>
                <Input
                  id="display_order"
                  type="number"
                  placeholder="0"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      display_order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <p className="text-xs text-gray-500">
                  მცირე რიცხვები ნაჩვენები იქნება პირველად
                </p>
              </div>

              {/* Is Active */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_active" className="block mb-1">
                    აქტიური
                  </Label>
                  <p className="text-xs text-gray-500">
                    გამორთეთ, რომ დამალოთ ფოტო საიტზე
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: checked,
                    }))
                  }
                />
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
