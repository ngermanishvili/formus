"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ImageUpload = ({ value, onChange, title }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Label className="text-base font-semibold">{title}</Label>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange("")}
              className="text-red-500 hover:text-red-600"
            >
              წაშლა
            </Button>
          )}
        </div>
        <CldUploadWidget
          uploadPreset="formus_test"
          onSuccess={(result) => onChange(result.info.secure_url)}
          options={{
            maxFiles: 1,
          }}
        >
          {({ open }) => (
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => open?.()}
                className="w-full h-64 border-dashed relative group"
              >
                {value ? (
                  <div className="relative w-full h-full">
                    <img
                      src={value}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm">შეცვლა</span>
                    </div>
                  </div>
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

export default function CreateApartmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const blockId = searchParams.get("blockId");

  const [formData, setFormData] = useState({
    apartment_number: "",
    floor: "",
    total_area: "",
    studio_area: "",
    bedroom_area: "",
    bedroom2_area: "",
    bathroom_area: "",
    bathroom2_area: "",
    living_room_area: "",
    balcony_area: "",
    balcony2_area: "",
    status: "available",
    home_2d: "",
    home_3d: "",
    block_id: blockId || "",
  });

  const apartmentStatuses = [
    { value: "available", label: "თავისუფალი" },
    { value: "sold", label: "გაყიდული" },
    { value: "reserved", label: "დაჯავშნილი" },
    { value: "in_progress", label: "მშენებარე" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateApartment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/apartments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "წარმატება",
          description: "ბინა წარმატებით დაემატა",
        });
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 2000);
      } else {
        throw new Error("Failed to create apartment");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: "ბინის დამატება ვერ მოხერხდა",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (fieldName) => (url) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: url,
    }));
  };

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">ახალი ბინის დამატება</h2>
          <form onSubmit={handleCreateApartment} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ბინის ნომერი</label>
                <Input
                  type="number"
                  name="apartment_number"
                  value={formData.apartment_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">სართული</label>
                <Input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">საერთო ფართი (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  name="total_area"
                  value={formData.total_area}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">სტუდიო (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  name="studio_area"
                  value={formData.studio_area}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">საძინებელი 1 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  name="bedroom_area"
                  value={formData.bedroom_area}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">საძინებელი 2 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  name="bedroom2_area"
                  value={formData.bedroom2_area}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">აბაზანა 1 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  name="bathroom_area"
                  value={formData.bathroom_area}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">აბაზანა 2 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  name="bathroom2_area"
                  value={formData.bathroom2_area}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">მისაღები (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  name="living_room_area"
                  value={formData.living_room_area}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">აივანი 1 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  name="balcony_area"
                  value={formData.balcony_area}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">აივანი 2 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  name="balcony2_area"
                  value={formData.balcony2_area}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">სტატუსი</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {apartmentStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ფოტოების სექცია */}
            <div>
              <h3 className="text-lg font-semibold mb-4">ბინის ვიზუალები</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  value={formData.home_2d}
                  onChange={handleImageChange("home_2d")}
                  title="2D რენდერი"
                />
                <ImageUpload
                  value={formData.home_3d}
                  onChange={handleImageChange("home_3d")}
                  title="3D რენდერი"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/dashboard")}
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
                  "დამატება"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
