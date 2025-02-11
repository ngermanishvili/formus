// app/(admin)/admin/dashboard/contact/[id]/edit/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function EditContact({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address_line_ge: "",
    address_line_en: "",
    phone_number: "",
    email: "",
    map_url: "",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/contactinfo/${params.id}`);
        const data = await res.json();

        if (data.status === "success" && data.data) {
          setFormData({
            address_line_ge: data.data.address_line_ge || "",
            address_line_en: data.data.address_line_en || "",
            phone_number: data.data.phone_number || "",
            email: data.data.email || "",
            map_url: data.data.map_url || "",
          });
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
      const res = await fetch(`/api/contactinfo/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("საკონტაქტო ინფორმაცია წარმატებით განახლდა");
        router.push("/admin/dashboard/contact");
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
      const res = await fetch(`/api/contactinfo/${params.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("საკონტაქტო ინფორმაცია წარმატებით წაიშალა");
        router.push("/admin/dashboard/contact");
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
            საკონტაქტო ინფორმაციის რედაქტირება
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>მისამართი (ქართულად)</Label>
              <Input
                required
                value={formData.address_line_ge}
                onChange={(e) =>
                  setFormData({ ...formData, address_line_ge: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>მისამართი (ინგლისურად)</Label>
              <Input
                required
                value={formData.address_line_en}
                onChange={(e) =>
                  setFormData({ ...formData, address_line_en: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>ტელეფონის ნომერი</Label>
              <Input
                required
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>ელ-ფოსტა</Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Google Maps URL</Label>
              <Input
                required
                value={formData.map_url}
                onChange={(e) =>
                  setFormData({ ...formData, map_url: e.target.value })
                }
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "მიმდინარეობს..." : "განახლება"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/dashboard/contact")}
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
                      ეს მოქმედება წაშლის საკონტაქტო ინფორმაციას. ეს მოქმედება
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
