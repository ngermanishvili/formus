// app/(admin)/admin/dashboard/contact/create/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CreateContact() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address_line_ge: "",
    address_line_en: "",
    phone_number: "",
    email: "",
    map_url: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contactinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success(data.message);
        router.push("/admin/dashboard/contact");
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
            საკონტაქტო ინფორმაციის დამატება
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

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "მიმდინარეობს..." : "დამატება"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/dashboard/contact")}
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
