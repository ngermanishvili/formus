"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  Building2,
  Save,
  X,
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
  DialogTrigger,
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
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [editingApartment, setEditingApartment] = useState(null);
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
  });

  useEffect(() => {
    fetch("/api/buildings")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setBlocks(data.data);
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
        setEditingApartment(null);
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

        // ხელახლა წამოვიღოთ ბინების სია
        const updatedResponse = await fetch(
          `/api/buildings/${selectedBlock}/apartments`
        );
        const updatedData = await updatedResponse.json();
        if (updatedData.status === "success") {
          setApartments(updatedData.data);
        }

        // გავასუფთაოთ ფორმა
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
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "შეცდომა ბინის დამატებისას",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <LayoutGrid className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              მშენებარე ბინების მართვა
            </h1>
          </div>
        </div>
      </div>

      <div className="pt-20 px-6 pb-6 mt-[120px]">
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-700">
                აირჩიეთ კორპუსი
              </h2>
            </div>
            {selectedBlock && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                ახალი ბინის დამატება
              </Button>
            )}
          </div>
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
                      className="h-11"
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

        {selectedBlock && (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="ძებნა..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-[300px]"
                  />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        სართული: {filterFloor === "all" ? "ყველა" : filterFloor}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
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

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
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
                        { key: "actions", label: "" },
                      ].map(({ key, label }) => (
                        <TableHead
                          key={key}
                          className={key === "actions" ? "w-[100px]" : ""}
                        >
                          {key !== "actions" ? (
                            <Button
                              variant="ghost"
                              onClick={() => handleSort(key)}
                              className="hover:bg-transparent"
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
                      <TableRow key={apt.apartment_id}>
                        {editingApartment?.apartment_id === apt.apartment_id ? (
                          <>
                            {Object.keys(apt)
                              .filter(
                                (key) =>
                                  key !== "apartment_id" &&
                                  key !== "status" &&
                                  key !== "actions"
                              )
                              .map((key) => (
                                <TableCell key={key}>
                                  <Input
                                    type="number"
                                    step={key.includes("area") ? "0.01" : "1"}
                                    value={editingApartment[key] || ""}
                                    onChange={(e) =>
                                      setEditingApartment({
                                        ...editingApartment,
                                        [key]: e.target.value,
                                      })
                                    }
                                    className="w-full"
                                  />
                                </TableCell>
                              ))}
                            <TableCell>
                              <div className="flex justify-end space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateApartment(
                                      apt.apartment_id,
                                      editingApartment
                                    )
                                  }
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingApartment(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            {Object.keys(apt)
                              .filter(
                                (key) =>
                                  key !== "apartment_id" &&
                                  key !== "status" &&
                                  key !== "actions"
                              )
                              .map((key) => (
                                <TableCell key={key}>
                                  {key.includes("area") ? (
                                    <Badge variant="outline">
                                      {apt[key]} მ²
                                    </Badge>
                                  ) : (
                                    apt[key]
                                  )}
                                </TableCell>
                              ))}
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => setEditingApartment(apt)}
                                  >
                                    რედაქტირება
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ახალი ბინის დამატების დიალოგი */}
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
                  type="number"
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
