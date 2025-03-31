"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ArrowUpDown,
  Building,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AdminPanel() {
  const router = useRouter();

  const apartmentStatuses = [
    { value: "available", label: "თავისუფალი" },
    { value: "sold", label: "გაყიდული" },
    { value: "reserved", label: "დაჯავშნილი" },
    { value: "in_progress", label: "მშენებარე" },
  ];

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("default");
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("all");
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
    project_id: "default",
  });

  // Fetch projects
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProjects(data.data);
          if (data.data.length > 0) {
            setSelectedProject(data.data[0].id.toString());
            setNewApartment((prev) => ({
              ...prev,
              project_id: data.data[0].id.toString(),
            }));
          } else {
            setSelectedProject("default");
            setNewApartment((prev) => ({
              ...prev,
              project_id: "default",
            }));
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  // Fetch blocks for selected project
  useEffect(() => {
    if (selectedProject && selectedProject !== "default") {
      fetch(`/api/building_blocks?project_id=${selectedProject}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            console.log(
              `Fetched blocks for project ${selectedProject}:`,
              data.data
            );
            setBlocks(data.data);
            if (data.data.length > 0) {
              setSelectedBlock("all"); // Start with "all" selected
              setNewApartment((prev) => ({
                ...prev,
                block_id: data.data[0].block_id,
              }));
            } else {
              setSelectedBlock("all");
              setNewApartment((prev) => ({
                ...prev,
                block_id: "all",
              }));
            }
          } else {
            console.error("Error in blocks response:", data);
            setBlocks([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching blocks:", error);
          setBlocks([]);
        });
    } else {
      setBlocks([]);
      setSelectedBlock("all");
      setNewApartment((prev) => ({
        ...prev,
        block_id: "all",
      }));
    }
  }, [selectedProject]);

  // Fetch apartments for selected project
  useEffect(() => {
    if (selectedProject && selectedProject !== "default") {
      const url = `/api/apartments?project_id=${selectedProject}`;
      console.log("Fetching apartments from:", url);
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log("Apartments API response:", data);
          if (data.status === "success") {
            console.log("Setting apartments:", data.data);
            setApartments(data.data);
          } else {
            console.error("Error in apartments response:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching apartments:", error);
        });
    }
  }, [selectedProject, selectedBlock]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filtered and sorted apartments
  const filteredAndSortedApartments = useMemo(() => {
    let filtered = apartments.filter((apartment) => {
      // Add debug logging to see what's being filtered
      console.log("Filtering apartment:", {
        apartment_number: apartment.apartment_number,
        block_id: apartment.block_id,
        block_id_type: typeof apartment.block_id,
        selected_block: selectedBlock,
        selected_block_type: typeof selectedBlock,
      });

      // Filter by search term
      if (
        searchTerm &&
        !apartment.apartment_number.toString().includes(searchTerm) &&
        !apartment.floor.toString().includes(searchTerm)
      ) {
        return false;
      }

      // Filter by floor
      if (
        filterFloor &&
        filterFloor !== "all" &&
        apartment.floor !== filterFloor
      ) {
        return false;
      }

      // Filter by block - but handle string vs number comparison correctly
      if (
        selectedBlock &&
        selectedBlock !== "all" &&
        String(apartment.block_id) !== String(selectedBlock)
      ) {
        return false;
      }

      return true;
    });

    console.log("Filtered apartments count:", filtered.length);

    // Sort apartments
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [apartments, searchTerm, filterFloor, selectedBlock, sortConfig]);

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
    // Make a copy of newApartment to avoid modifying state directly
    const apartmentData = { ...newApartment };

    // Handle any "all" or "default" values
    if (
      apartmentData.block_id === "all" ||
      apartmentData.block_id === "no_blocks"
    ) {
      console.error("Block must be selected");
      setNotification({
        type: "error",
        message: "აირჩიეთ ბლოკი",
      });
      return;
    }

    if (apartmentData.project_id === "default") {
      console.error("პროექტი არ არის არჩეული");
      setNotification({
        type: "error",
        message: "აირჩიეთ პროექტი",
      });
      return;
    }

    // ჩვენ აღარ ვუგზავნით project_id-ს აპარტამენტის ცხრილს.
    // block_id უკვე დაკავშირებულია კონკრეტული პროექტთან ბაზაში

    try {
      const response = await fetch("/api/apartments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...apartmentData,
          block_id: apartmentData.block_id,
          // აღარ ვუგზავნით project_id-ს
        }),
      });

      if (response.ok) {
        setNotification({
          type: "success",
          message: "ბინა წარმატებით დაემატა",
        });
        setIsAddDialogOpen(false);

        // ბინების სიის განახლება
        // შეცვლილია: თუ project_id არის default, მაშინ არ ვაგზავნით მოთხოვნას
        if (selectedProject !== "default") {
          const updatedResponse = await fetch(`/api/apartments`);
          const updatedData = await updatedResponse.json();
          if (updatedData.status === "success") {
            setApartments(updatedData.data);
          }
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
          project_id: selectedProject,
          block_id: "all",
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

  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId === "default" ? "default" : projectId);
    setNewApartment((prev) => ({
      ...prev,
      project_id: projectId === "default" ? "default" : projectId,
    }));
  };

  const handleBlockChange = (blockId) => {
    setSelectedBlock(blockId === "all" ? "all" : blockId);
    setNewApartment((prev) => ({
      ...prev,
      block_id: blockId === "all" ? "all" : blockId,
    }));
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

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">ბინების მართვა</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              ახალი ბინის დამატება
            </Button>
            <Button
              onClick={() => router.push("/admin/dashboard/projects")}
              className="flex items-center"
            >
              <Building className="mr-2 h-4 w-4" />
              პროექტების მართვა
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          {/* Project Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-gray-500" />
                <span className="font-medium">პროექტი</span>
              </div>
              <div className="mt-2">
                <Select
                  value={selectedProject}
                  onValueChange={handleProjectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ პროექტი" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">აირჩიეთ პროექტი</SelectItem>
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
            </CardContent>
          </Card>

          {/* Block Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Building2 className="mr-2 h-5 w-5 text-gray-500" />
                <span className="font-medium">ბლოკი</span>
              </div>
              <div className="mt-2">
                <Select
                  value={selectedBlock}
                  onValueChange={handleBlockChange}
                  disabled={!selectedProject || projects.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ ბლოკი" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ყველა ბლოკი</SelectItem>
                    {blocks.length > 0 ? (
                      blocks.map((block) => (
                        <SelectItem key={block.block_id} value={block.block_id}>
                          ბლოკი {block.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no_blocks" disabled>
                        ბლოკები არ არის
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-gray-500" />
                <span className="font-medium">ძებნა</span>
              </div>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="ბინის ნომერი, სართული..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("apartment_number")}
                  >
                    <div className="flex items-center">
                      ბინის ნომერი
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>პროექტი</TableHead>
                  <TableHead>ბლოკი</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("floor")}
                  >
                    <div className="flex items-center">
                      სართული
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("total_area")}
                  >
                    <div className="flex items-center">
                      საერთო ფართი
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>სტატუსი</TableHead>
                  <TableHead className="text-right">მოქმედებები</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedApartments.length > 0 ? (
                  filteredAndSortedApartments.map((apartment) => (
                    <TableRow key={apartment.apartment_id}>
                      <TableCell className="font-medium">
                        {apartment.apartment_id}
                      </TableCell>
                      <TableCell>{apartment.apartment_number}</TableCell>
                      <TableCell>{apartment.project_name || "N/A"}</TableCell>
                      <TableCell>
                        {apartment.block_name || apartment.block_id}
                      </TableCell>
                      <TableCell>{apartment.floor}</TableCell>
                      <TableCell>{apartment.total_area} მ²</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(apartment.status)}
                        >
                          {apartmentStatuses.find(
                            (s) => s.value === apartment.status
                          )?.label || apartment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">მენიუ</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>მოქმედებები</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleEditClick(apartment.apartment_id)
                              }
                            >
                              რედაქტირება
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/apartment/${apartment.apartment_id}-${apartment.apartment_number}-${apartment.floor}`
                                )
                              }
                            >
                              ნახვა
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {selectedProject === "default"
                        ? "აირჩიეთ პროექტი"
                        : "ბინები ვერ მოიძებნა"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ახალი ბინის დამატება</DialogTitle>
            <DialogDescription>
              შეავსეთ ბინის დეტალები და დააჭირეთ დამატების ღილაკს
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Project Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                პროექტი
              </Label>
              <Select
                value={newApartment.project_id || "default"}
                onValueChange={(value) =>
                  setNewApartment((prev) => ({ ...prev, project_id: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="აირჩიეთ პროექტი" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">აირჩიეთ პროექტი</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.title_ge}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Block Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="block" className="text-right">
                ბლოკი
              </Label>
              <Select
                value={newApartment.block_id}
                onValueChange={(value) =>
                  setNewApartment((prev) => ({ ...prev, block_id: value }))
                }
                disabled={
                  !newApartment.project_id ||
                  newApartment.project_id === "default" ||
                  projects.length === 0
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="აირჩიეთ ბლოკი" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ყველა ბლოკი</SelectItem>
                  {blocks.length > 0 ? (
                    blocks.map((block) => (
                      <SelectItem key={block.block_id} value={block.block_id}>
                        ბლოკი {block.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no_blocks" disabled>
                      ბლოკები არ არის
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apartment-number" className="text-right">
                ბინის ნომერი
              </Label>
              <Input
                id="apartment-number"
                type="number"
                value={newApartment.apartment_number}
                onChange={(e) =>
                  setNewApartment({
                    ...newApartment,
                    apartment_number: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="floor" className="text-right">
                სართული
              </Label>
              <Input
                id="floor"
                type="number"
                value={newApartment.floor}
                onChange={(e) =>
                  setNewApartment({ ...newApartment, floor: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total-area" className="text-right">
                ფართი (მ²)
              </Label>
              <Input
                id="total-area"
                type="number"
                step="0.01"
                value={newApartment.total_area}
                onChange={(e) =>
                  setNewApartment({
                    ...newApartment,
                    total_area: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                სტატუსი
              </Label>
              <select
                id="status"
                value={newApartment.status}
                onChange={(e) =>
                  setNewApartment({ ...newApartment, status: e.target.value })
                }
                className="col-span-3 rounded-md border border-gray-300 p-2"
              >
                {apartmentStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              გაუქმება
            </Button>
            <Button
              type="button"
              onClick={handleAddApartment}
              disabled={
                !newApartment.apartment_number ||
                !newApartment.floor ||
                !newApartment.total_area ||
                newApartment.project_id === "default" ||
                (newApartment.block_id === "all" && blocks.length > 0) ||
                newApartment.block_id === "no_blocks"
              }
            >
              დამატება
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
