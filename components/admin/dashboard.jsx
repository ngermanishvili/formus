"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ArrowUpDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminPanel() {
  const router = useRouter();

  const apartmentStatuses = [
    { value: "available", label: "თავისუფალი" },
    { value: "sold", label: "გაყიდული" },
    { value: "reserved", label: "დაჯავშნული" },
    { value: "in_progress", label: "მშენებარე" },
  ];

  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [notification, setNotification] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "floor",
    direction: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFloor, setFilterFloor] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newApartment, setNewApartment] = useState({
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
  });

  useEffect(() => {
    fetch("/api/buildings")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setBlocks(data.data);
          setSelectedBlock(data.data[0]?.block_id);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedBlock) {
      fetch(`/api/buildings/${selectedBlock}/apartments`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setApartments(data.data);
          }
        });
    }
  }, [selectedBlock]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedApartments = [...apartments]
    .filter((apt) => {
      const matchesSearch =
        apt.apartment_number.toString().includes(searchTerm) ||
        apt.floor.toString().includes(searchTerm) ||
        apt.total_area.toString().includes(searchTerm);

      const matchesFloor =
        filterFloor === "all" || apt.floor.toString() === filterFloor;

      return matchesSearch && matchesFloor;
    })
    .sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  const handleUpdateApartment = async (apartmentId, updatedData) => {
    try {
      const response = await fetch(`/api/apartments/${apartmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedApartments = apartments.map((apt) =>
          apt.apartment_id === apartmentId ? { ...apt, ...updatedData } : apt
        );
        setApartments(updatedApartments);
        setNotification({
          type: "success",
          message: "ბინის მონაცემები წარმატებით განახლდა",
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "შეცდომა მონაცემების განახლებისას",
      });
    }
  };

  const handleAddApartment = async () => {
    try {
      const response = await fetch("/api/apartments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newApartment,
          block_id: selectedBlock,
        }),
      });

      if (response.ok) {
        setNotification({
          type: "success",
          message: "ბინა წარმატებით დაემატა",
        });
        setIsAddDialogOpen(false);

        const updatedResponse = await fetch(
          `/api/buildings/${selectedBlock}/apartments`
        );
        const updatedData = await updatedResponse.json();
        if (updatedData.status === "success") {
          setApartments(updatedData.data);
        }

        setNewApartment({
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
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "შეცდომა ბინის დამატებისას",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-50 text-green-700 border-green-200";
      case "sold":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "reserved":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "in_progress":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleEditClick = (apartmentId) => {
    router.push(`/admin/dashboard/apartments/${apartmentId}/edit`);
  };

  return (
    <div className="bg-gray-50">
      <div className="pt-20 px-6 pb-6">
        {notification && (
          <Alert
            className={`mb-4 ${
              notification.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <AlertDescription
              className={
                notification.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }
            >
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-700">
                აირჩიეთ კორპუსი
              </h2>
            </div>
            {selectedBlock && (
              <Button
                onClick={() =>
                  router.push(
                    `/admin/dashboard/apartments/create?blockId=${selectedBlock}`
                  )
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                ახალი ბინის დამატება
              </Button>
            )}
          </div>{" "}
          <div className="flex flex-wrap gap-3">
            {blocks.map((block) => (
              <TooltipProvider key={block.block_id}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant={
                        selectedBlock === block.block_id ? "default" : "outline"
                      }
                      onClick={() => setSelectedBlock(block.block_id)}
                      className={`h-11 ${
                        selectedBlock === block.block_id
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "hover:bg-blue-50"
                      }`}
                    >
                      {block.block_name}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>კორპუსი {block.block_name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
        <span className="text-xs text-red-500 py-2">
          ახალი ბინის დამატების დროს ბლოკი განისაზღვება იმის მიხედვით თუ რომელი
          ბლოკი გაქვთ ზემოთ მონიშნული.{" "}
        </span>

        {selectedBlock && (
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-0">
              <div className="p-6 bg-white border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="ძებნა..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-[300px] border-gray-200 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-gray-200">
                          სართული:{" "}
                          {filterFloor === "all" ? "ყველა" : filterFloor}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        <DropdownMenuLabel>აირჩიეთ სართული</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {[
                          "all",
                          ...new Set(
                            apartments.map((apt) => apt.floor.toString())
                          ),
                        ]
                          .sort()
                          .map((floor) => (
                            <DropdownMenuItem
                              key={floor}
                              onClick={() => setFilterFloor(floor)}
                              className="cursor-pointer hover:bg-blue-50"
                            >
                              {floor === "all"
                                ? "ყველა სართული"
                                : `${floor} სართული`}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      {[
                        { key: "apartment_number", label: "ბინის №" },
                        { key: "floor", label: "სართული" },
                        { key: "total_area", label: "საერთო ფართი" },
                        { key: "studio_area", label: "სტუდიო" },
                        { key: "bedroom_area", label: "საძინებელი" },
                        { key: "bedroom2_area", label: "საძინებელი 2" },
                        { key: "bathroom_area", label: "აბაზანა" },
                        { key: "bathroom2_area", label: "აბაზანა 2" },
                        { key: "living_room_area", label: "მისაღები" },
                        { key: "balcony_area", label: "აივანი" },
                        { key: "balcony2_area", label: "აივანი 2" },
                        { key: "status", label: "სტატუსი" },
                        { key: "actions", label: "" },
                      ].map(({ key, label }) => (
                        <TableHead
                          key={key}
                          className={`${
                            key === "actions" ? "w-[100px]" : ""
                          } bg-gray-50 text-gray-600`}
                        >
                          {key !== "actions" ? (
                            <Button
                              variant="ghost"
                              onClick={() => handleSort(key)}
                              className="hover:bg-gray-100 text-gray-600 font-medium"
                            >
                              {label}
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          ) : (
                            label
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedApartments.map((apt) => (
                      <TableRow
                        key={apt.apartment_id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        {Object.keys(apt)
                          .filter(
                            (key) => key !== "apartment_id" && key !== "actions"
                          )
                          .map((key) => (
                            <TableCell key={key} className="py-3">
                              {key === "status" ? (
                                <Badge
                                  variant="outline"
                                  className={getStatusColor(apt[key])}
                                >
                                  {apartmentStatuses.find(
                                    (s) => s.value === apt[key]
                                  )?.label || "უცნობი"}
                                </Badge>
                              ) : key.includes("area") ? (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {apt[key]} მ²
                                </Badge>
                              ) : (
                                <span className="font-medium text-gray-700">
                                  {apt[key]}
                                </span>
                              )}
                            </TableCell>
                          ))}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditClick(apt.apartment_id)
                                }
                                className="cursor-pointer hover:bg-blue-50"
                              >
                                რედაქტირება
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <span className="text-green-400 font-medium p-2">
                                სტატუსის შეცვლა
                              </span>
                              {apartmentStatuses.map((status) => (
                                <DropdownMenuItem
                                  key={status.value}
                                  onClick={() =>
                                    handleUpdateApartment(apt.apartment_id, {
                                      ...apt,
                                      status: status.value,
                                    })
                                  }
                                  className="cursor-pointer hover:bg-blue-50"
                                >
                                  {status.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>ახალი ბინის დამატება</DialogTitle>
              <DialogDescription>
                შეავსეთ ყველა საჭირო ველი ახალი ბინის დასამატებლად
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ბინის ნომერი</label>
                <Input
                  type="text"
                  value={newApartment.apartment_number}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      apartment_number: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">სართული</label>
                <Input
                  type="number"
                  value={newApartment.floor}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      floor: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">საერთო ფართი (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newApartment.total_area}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      total_area: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">სტუდიო (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newApartment.studio_area}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      studio_area: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">საძინებელი 1 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newApartment.bedroom_area}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      bedroom_area: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">საძინებელი 2 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newApartment.bedroom2_area}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      bedroom2_area: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">აბაზანა 1 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newApartment.bathroom_area}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      bathroom_area: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">აბაზანა 2 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newApartment.bathroom2_area}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      bathroom2_area: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">მისაღები (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newApartment.living_room_area}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      living_room_area: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">აივანი 1 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newApartment.balcony_area}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      balcony_area: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">აივანი 2 (მ²)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newApartment.balcony2_area}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      balcony2_area: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">სტატუსი</label>
                <select
                  value={newApartment.status}
                  onChange={(e) =>
                    setNewApartment({
                      ...newApartment,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {apartmentStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                გაუქმება
              </Button>
              <Button onClick={handleAddApartment}>დამატება</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
