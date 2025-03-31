"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [projects, setProjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const blockId = searchParams.get("blockId");
  const projectId = searchParams.get("projectId") || "1"; // Default to project 1 (Ortachala Hills)

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
    project_id: projectId,
  });

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const { data } = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Fetch blocks when project_id changes
  useEffect(() => {
    if (formData.project_id) {
      const fetchBlocks = async () => {
        try {
          const response = await fetch(
            `/api/building_blocks?project_id=${formData.project_id}`
          );
          if (response.ok) {
            const { data } = await response.json();
            console.log(
              `Fetched ${data.length} blocks for project ${formData.project_id}`
            );
            setBlocks(data);

            // Reset block_id if the current one is not in the new list of blocks
            if (
              formData.block_id &&
              !data.some(
                (block) =>
                  block.block_id.toString() === formData.block_id.toString()
              )
            ) {
              setFormData((prev) => ({
                ...prev,
                block_id: data.length > 0 ? data[0].block_id.toString() : "",
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching blocks:", error);
        }
      };

      fetchBlocks();
    }
  }, [formData.project_id]);

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

  const handleSelectChange = (name, value) => {
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
              {/* Project Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">პროექტი</label>
                <Select
                  value={formData.project_id}
                  onValueChange={(value) =>
                    handleSelectChange("project_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ პროექტი" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id.toString()}
                      >
                        {project.title_ge}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Block Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">ბლოკი</label>
                <Select
                  value={formData.block_id}
                  onValueChange={(value) =>
                    handleSelectChange("block_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ ბლოკი" />
                  </SelectTrigger>
                  <SelectContent>
                    {blocks.map((block) => (
                      <SelectItem
                        key={block.block_id}
                        value={block.block_id.toString()}
                      >
                        {block.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ სტატუსი" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartmentStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                title="ბინის 2D გეგმა"
                value={formData.home_2d}
                onChange={handleImageChange("home_2d")}
              />
              <ImageUpload
                title="ბინის 3D გეგმა"
                value={formData.home_3d}
                onChange={handleImageChange("home_3d")}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    მიმდინარეობს დამატება...
                  </>
                ) : (
                  "დაამატე"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
