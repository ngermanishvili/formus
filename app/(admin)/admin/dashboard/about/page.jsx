"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CldUploadWidget } from "next-cloudinary";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Edit, ImagePlus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

// სურათის ატვირთვის კომპონენტი
const ImageUpload = ({ value, onChange }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <Label className="text-base font-semibold mb-4 block">სურათი</Label>
        <CldUploadWidget
          uploadPreset="formus_test"
          onSuccess={(result) => onChange(result.info.secure_url)}
          options={{
            maxFiles: 1,
            resourceType: "image",
          }}
        >
          {({ open }) => (
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => open()}
                className="w-full h-64 border-dashed"
              >
                {value ? (
                  <img
                    src={value}
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
            </div>
          )}
        </CldUploadWidget>
      </CardContent>
    </Card>
  );
};

export default function AboutPage() {
  const [loading, setLoading] = useState(false);
  const [aboutData, setAboutData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title_ge: "",
    title_en: "",
    description_ge: "",
    description_en: "",
    image_url: "",
    map_url: "",
    address_ge: "",
    address_en: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data.status === "success") {
        setAboutData(data.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: "მონაცემების ჩატვირთვა ვერ მოხერხდა",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a new formData object with the updated image_url
      const updatedFormData = { ...formData };

      const res = await fetch(`/api/about/${selectedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast({
          title: "წარმატება",
          description: "ინფორმაცია განახლდა",
        });
        fetchAboutData();
        setIsDialogOpen(false);
        setSelectedItem(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: "განახლება ვერ მოხერხდა",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ჩვენ შესახებ</h1>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">სურათი</TableHead>
              <TableHead>სათაური</TableHead>
              <TableHead>აღწერა</TableHead>
              <TableHead className="text-right">მოქმედება</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aboutData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  ინფორმაცია არ მოიძებნა
                </TableCell>
              </TableRow>
            ) : (
              aboutData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.image_url && (
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.image_url}
                          alt={item.title_ge}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{item.title_ge}</div>
                      <div className="text-sm text-gray-500">
                        {item.title_en}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="line-clamp-2">{item.description_ge}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {item.description_en}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ინფორმაციის რედაქტირება</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium mb-1">
                  სათაური (ქართ.)
                </Label>
                <Input
                  value={formData.title_ge}
                  onChange={(e) =>
                    setFormData({ ...formData, title_ge: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  სათაური (ინგლ.)
                </label>
                <Input
                  value={formData.title_en}
                  onChange={(e) =>
                    setFormData({ ...formData, title_en: e.target.value })
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  აღწერა (ქართ.)
                </label>
                <Textarea
                  value={formData.description_ge}
                  onChange={(e) =>
                    setFormData({ ...formData, description_ge: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  აღწერა (ინგლ.)
                </label>
                <Textarea
                  value={formData.description_en}
                  onChange={(e) =>
                    setFormData({ ...formData, description_en: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  რუკის URL
                </label>
                <Input
                  value={formData.map_url}
                  onChange={(e) =>
                    setFormData({ ...formData, map_url: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  ტელეფონი
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  მისამართი (ქართ.)
                </label>
                <Input
                  value={formData.address_ge}
                  onChange={(e) =>
                    setFormData({ ...formData, address_ge: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  მისამართი (ინგლ.)
                </label>
                <Input
                  value={formData.address_en}
                  onChange={(e) =>
                    setFormData({ ...formData, address_en: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  ელ-ფოსტა
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}
              >
                გაუქმება
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[150px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    იტვირთება...
                  </>
                ) : (
                  "შენახვა"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
