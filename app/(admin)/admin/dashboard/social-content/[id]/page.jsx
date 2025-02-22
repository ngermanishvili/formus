"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export default function EditSocialLink({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    platform: "",
    platform_key: "",
    url: "",
    is_visible: false,
    display_order: 0,
  });

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await fetch(`/api/social-links/${params.id}`);
        const result = await response.json();

        if (result.status === "success" && result.data) {
          setFormData(result.data);
        }
      } catch (error) {
        console.error("Error fetching social link:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const response = await fetch(`/api/social-links/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/dashboard/social-content");
      } else {
        throw new Error("Failed to update social link");
      }
    } catch (error) {
      console.error("Error updating social link:", error);
      alert("Error updating social link");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          სოციალური ქსელის რედაქტირება
        </h1>
        <p className="text-gray-500 mt-1">
          შეცვალეთ სოციალური ქსელის პარამეტრები
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>სოციალური ქსელი</Label>
              <Input value={formData.platform} disabled />
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
            disabled={submitLoading}
          >
            გაუქმება
          </Button>
          <Button
            type="submit"
            disabled={submitLoading}
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
      </form>
    </div>
  );
}
