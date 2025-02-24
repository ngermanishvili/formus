import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const AddApartmentDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
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
  },
}) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData(initialData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field.includes("area")
        ? parseFloat(e.target.value)
        : e.target.value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>ახალი ბინის დამატება</DialogTitle>
          <DialogDescription>
            შეავსეთ ყველა საჭირო ველი ახალი ბინის დასამატებლად
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ბინის ნომერი</label>
            <Input
              required
              type="text"
              value={formData.apartment_number}
              onChange={handleChange("apartment_number")}
              placeholder="მაგ: A12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">სართული</label>
            <Input
              required
              type="number"
              value={formData.floor}
              onChange={handleChange("floor")}
              placeholder="მაგ: 5"
            />
          </div>
          {/* ფართობების ველები */}
          <div className="space-y-2">
            <label className="text-sm font-medium">საერთო ფართი (მ²)</label>
            <Input
              required
              type="number"
              step="0.01"
              value={formData.total_area}
              onChange={handleChange("total_area")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">სტატუსი</label>
            <select
              value={formData.status}
              onChange={handleChange("status")}
              className="w-full p-2 border rounded"
            >
              <option value="available">ხელმისაწვდომი</option>
              <option value="sold">გაყიდული</option>
              <option value="reserved">დაჯავშნილი</option>
            </select>
          </div>
          {/* ოთახების ფართობები */}
          {[
            ["studio_area", "სტუდიო"],
            ["bedroom_area", "საძინებელი 1"],
            ["bedroom2_area", "საძინებელი 2"],
            ["bathroom_area", "აბაზანა 1"],
            ["bathroom2_area", "აბაზანა 2"],
            ["living_room_area", "მისაღები"],
            ["balcony_area", "აივანი 1"],
            ["balcony2_area", "აივანი 2"],
          ].map(([field, label]) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium">{label} (მ²)</label>
              <Input
                type="number"
                step="0.01"
                value={formData[field]}
                onChange={handleChange(field)}
              />
            </div>
          ))}

          <div className="col-span-2 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              გაუქმება
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "იტვირთება..." : "დამატება"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
