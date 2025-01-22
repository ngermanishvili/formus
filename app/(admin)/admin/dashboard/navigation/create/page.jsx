"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";

export default function CreateRoute() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    path: "",
    translations: {
      ka: "",
      en: "",
    },
    is_active: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const pathRegex = /^[a-z0-9-]+$/;
    if (!pathRegex.test(formData.path)) {
      toast.error(
        "გზა (Path) უნდა შეიცავდეს მხოლოდ პატარა ასოებს, ციფრებს და დეფისს"
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/navigation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error("ასეთი გზა (Path) უკვე არსებობს");
        } else {
          toast.error(data.message || "დამატებისას დაფიქსირდა შეცდომა");
        }
        return;
      }

      if (data.status === "success") {
        toast.success("ნავიგაციის ელემენტი წარმატებით დაემატა");
        router.push("/admin/dashboard/navigation");
        router.refresh();
      }
    } catch (error) {
      toast.error("დამატებისას დაფიქსირდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  const handlePathChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, path: value });
  };

  const isFormValid = () => {
    return (
      formData.path.trim() !== "" &&
      formData.translations.ka.trim() !== "" &&
      formData.translations.en.trim() !== "" &&
      /^[a-z0-9-]+$/.test(formData.path)
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-red-400">
            ახალი ნავიგაციის ელემენტის დამატება (დეველოპერებისთვის)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">გზა (Path)</Label>
              <Input
                required
                className="w-full border rounded-lg"
                value={formData.path}
                onChange={handlePathChange}
                placeholder="მაგ: about-us"
                pattern="[a-z0-9-]+"
                title="გამოიყენეთ მხოლოდ პატარა ასოები, ციფრები და დეფისი"
              />
              <div className="flex items-start space-x-2 mt-1">
                <InfoIcon className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-sm text-gray-600">
                  მხოლოდ პატარა ასოები, ციფრები და დეფისი
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">სათაური (ქართულად)</Label>
              <Input
                required
                className="w-full border rounded-lg"
                value={formData.translations.ka}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      ka: e.target.value,
                    },
                  })
                }
                placeholder="მაგ: ჩვენს შესახებ"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                სათაური (ინგლისურად)
              </Label>
              <Input
                required
                className="w-full border rounded-lg"
                value={formData.translations.en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      en: e.target.value,
                    },
                  })
                }
                placeholder="მაგ: About Us"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label className="text-sm font-medium">აქტიური</Label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                disabled={loading || !isFormValid()}
              >
                {loading ? "მიმდინარეობს..." : "დამატება"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.push("/admin/dashboard/navigation")}
              >
                გაუქმება
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
