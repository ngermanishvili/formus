// app/[locale]/admin/dashboard/sliders/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Pencil,
  Plus,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SlidersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch("/api/sliders");
      const data = await response.json();
      if (data.status === "success") {
        setSliders(data.data);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
      toast({
        title: "შეცდომა",
        description: "სლაიდერების ჩატვირთვა ვერ მოხერხდა",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("ნამდვილად გსურთ სლაიდერის წაშლა?")) return;

    try {
      const response = await fetch(`/api/sliders/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "წარმატება",
          description: "სლაიდერი წაიშალა",
        });
        fetchSliders();
      }
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast({
        title: "შეცდომა",
        description: "სლაიდერის წაშლა ვერ მოხერხდა",
        variant: "destructive",
      });
    }
  };

  const updatePosition = async (id, direction) => {
    try {
      const response = await fetch(`/api/sliders/${id}/position`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      });

      if (response.ok) {
        fetchSliders();
      }
    } catch (error) {
      console.error("Error updating position:", error);
      toast({
        title: "შეცდომა",
        description: "პოზიციის შეცვლა ვერ მოხერხდა",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">სლაიდერები</h1>
        <Button onClick={() => router.push("/admin/dashboard/sliders/create")}>
          <Plus className="h-4 w-4 mr-2" />
          ახალი სლაიდერი
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>სათაური (ქართული)</TableHead>
            <TableHead>სათაური (ინგლისური)</TableHead>
            <TableHead>პოზიცია</TableHead>
            <TableHead className="w-[100px]">მოქმედებები</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sliders.map((slider) => (
            <TableRow key={slider.id}>
              <TableCell>{slider.title_ge}</TableCell>
              <TableCell>{slider.title_en}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {slider.order_position}
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePosition(slider.id, "up")}
                      disabled={slider.order_position === 1}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updatePosition(slider.id, "down")}
                      disabled={slider.order_position === sliders.length}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/dashboard/sliders/${slider.id}/edit`)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(slider.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
