"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CreateHeroContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    image_url: "",
    title_en: "",
    title_ge: "",
    description_en: "",
    description_ge: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/hero-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success(data.message);
        router.push("/admin/dashboard/hero-content");
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("დამატებისას დაფიქსირდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Hero კონტენტის დამატება
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>სურათის URL</Label>
              <Input
                required
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>სათაური (ქართულად)</Label>
              <Input
                required
                value={formData.title_ge}
                onChange={(e) =>
                  setFormData({ ...formData, title_ge: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>სათაური (ინგლისურად)</Label>
              <Input
                required
                value={formData.title_en}
                onChange={(e) =>
                  setFormData({ ...formData, title_en: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>აღწერა (ქართულად)</Label>
              <Textarea
                required
                value={formData.description_ge}
                onChange={(e) =>
                  setFormData({ ...formData, description_ge: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>აღწერა (ინგლისურად)</Label>
              <Textarea
                required
                value={formData.description_en}
                onChange={(e) =>
                  setFormData({ ...formData, description_en: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "მიმდინარეობს..." : "დამატება"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/dashboard/hero-content")}
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
