// app/(admin)/admin/dashboard/social-media/create/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export default function CreateSocialLink() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    platform: "",
    platform_key: "",
    url: "",
    is_visible: false,
    display_order: 0,
  });

  const socialPlatforms = [
    { name: "Facebook", key: "facebook" },
    { name: "Instagram", key: "instagram" },
    { name: "LinkedIn", key: "linkedin" },
    { name: "TikTok", key: "tiktok" },
    { name: "YouTube", key: "youtube" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/social-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/dashboard/social-media");
      } else {
        throw new Error("Failed to create social link");
      }
    } catch (error) {
      console.error("Error creating social link:", error);
      alert("Error creating social link");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.platform && formData.platform_key && formData.url;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          სოციალური ქსელის დამატება
        </h1>
        <p className="text-gray-500 mt-1">
          შეავსეთ სოციალური ქსელის პარამეტრები
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>სოციალური ქსელი</Label>
              <Select
                value={formData.platform_key}
                onValueChange={(value) => {
                  const platform = socialPlatforms.find((p) => p.key === value);
                  setFormData((prev) => ({
                    ...prev,
                    platform: platform.name,
                    platform_key: platform.key,
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="აირჩიეთ სოციალური ქსელი" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform.key} value={platform.key}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ლინკი</Label>
              <Input
                placeholder="შეიყვანეთ URL"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>თანმიმდევრობა</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    display_order: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>ხილვადობა</Label>
              <Switch
                checked={formData.is_visible}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_visible: checked,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
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
            // app/(admin)/admin/dashboard/social-media/create/page.jsx -
            დასასრული
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
      </form>
    </div>
  );
}
