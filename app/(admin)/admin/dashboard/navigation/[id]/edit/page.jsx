"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditRoute({ params }) {
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

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch(`/api/navigation/${params.id}`);
        const data = await res.json();

        if (data.status === "success") {
          setFormData({
            path: data.data.path,
            translations: data.data.translations,
            is_active: data.data.is_active,
          });
        } else {
          toast.error("მონაცემების ჩატვირთვისას დაფიქსირდა შეცდომა");
        }
      } catch (error) {
        toast.error("მონაცემების ჩატვირთვისას დაფიქსირდა შეცდომა");
      }
    };

    fetchRoute();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/navigation/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("ნავიგაციის ელემენტი წარმატებით განახლდა");
        router.push("/admin/dashboard/navigation");
        router.refresh();
      } else {
        toast.error(data.message || "განახლებისას დაფიქსირდა შეცდომა");
      }
    } catch (error) {
      toast.error("განახლებისას დაფიქსირდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/navigation/${params.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("ნავიგაციის ელემენტი წარმატებით წაიშალა");
        router.push("/admin/dashboard/navigation");
        router.refresh();
      } else {
        toast.error(data.message || "წაშლისას დაფიქსირდა შეცდომა");
      }
    } catch (error) {
      toast.error("წაშლისას დაფიქსირდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            ნავიგაციის ელემენტის რედაქტირება
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
                onChange={(e) =>
                  setFormData({ ...formData, path: e.target.value })
                }
              />
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
                disabled={loading}
              >
                {loading ? "მიმდინარეობს..." : "განახლება"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.push("/admin/dashboard/navigation")}
              >
                გაუქმება
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full sm:w-auto"
                    disabled={loading}
                  >
                    წაშლა
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>დარწმუნებული ხართ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      ეს მოქმედება წაშლის ნავიგაციის ელემენტს. ეს მოქმედება
                      შეუქცევადია.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      წაშლა
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
