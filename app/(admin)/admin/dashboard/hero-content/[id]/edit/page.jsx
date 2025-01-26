// app/(admin)/admin/dashboard/hero-content/[id]/edit/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function EditHeroContent({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
    title_en: "",
    title_ge: "",
    description_en: "",
    description_ge: ""
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/hero-content/${params.id}`);
        const data = await res.json();

        if (data.status === "success") {
          setFormData(data.data);
        } else {
          toast.error("მონაცემების ჩატვირთვისას დაფიქსირდა შეცდომა");
        }
      } catch (error) {
        toast.error("მონაცემების ჩატვირთვისას დაფიქსირდა შეცდომა");
      }
    };

    fetchContent();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/hero-content/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Hero კონტენტი წარმატებით განახლდა");
        router.push("/admin/dashboard/hero-content");
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
      const res = await fetch(`/api/hero-content/${params.id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Hero კონტენტი წარმატებით წაიშალა");
        router.push("/admin/dashboard/hero-content");
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
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Hero კონტენტის რედაქტირება
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>სურათის URL</Label>
              <Input
                required
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>სათაური (ქართულად)</Label>
              <Input
                required
                value={formData.title_ge}
                onChange={(e) => setFormData({...formData, title_ge: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>სათაური (ინგლისურად)</Label>
              <Input
                required
                value={formData.title_en}
                onChange={(e) => setFormData({...formData, title_en: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>აღწერა (ქართულად)</Label>
              <Textarea
                required
                value={formData.description_ge}
                onChange={(e) => setFormData({...formData, description_ge: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>აღწერა (ინგლისურად)</Label>
              <Textarea
                required
                value={formData.description_en}
                onChange={(e) => setFormData({...formData, description_en: e.target.value})}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "მიმდინარეობს..." : "განახლება"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/dashboard/hero-content")}
              >
                გაუქმება
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    წაშლა
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>დარწმუნებული ხართ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      ეს მოქმედება წაშლის Hero კონტენტს. ეს მოქმედება შეუქცევადია.
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