import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Save, X } from "lucide-react";
import { getStatusText } from "@/lib/utils";

export const ApartmentList = ({
  apartments,
  onEdit,
  onStatusChange,
  onDelete,
  editingApartment,
  setEditingApartment,
  onSaveEdit,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-50 text-green-700 border-green-200";
      case "sold":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "reserved":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ბინის №</TableHead>
            <TableHead>სართული</TableHead>
            <TableHead>საერთო ფართი</TableHead>
            <TableHead>სტატუსი</TableHead>
            <TableHead>ოთახები</TableHead>
            <TableHead className="text-right">მოქმედებები</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apartments.map((apartment) => (
            <TableRow key={apartment.apartment_id}>
              {editingApartment?.apartment_id === apartment.apartment_id ? (
                // რედაქტირების რეჟიმი
                <>
                  <TableCell>
                    <input
                      type="text"
                      value={editingApartment.apartment_number}
                      onChange={(e) =>
                        setEditingApartment({
                          ...editingApartment,
                          apartment_number: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      value={editingApartment.floor}
                      onChange={(e) =>
                        setEditingApartment({
                          ...editingApartment,
                          floor: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      step="0.01"
                      value={editingApartment.total_area}
                      onChange={(e) =>
                        setEditingApartment({
                          ...editingApartment,
                          total_area: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <select
                      value={editingApartment.status}
                      onChange={(e) =>
                        setEditingApartment({
                          ...editingApartment,
                          status: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="available">ხელმისაწვდომი</option>
                      <option value="sold">გაყიდული</option>
                      <option value="reserved">დაჯავშნილი</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onSaveEdit(editingApartment)}
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
                // ჩვეულებრივი ხედვის რეჟიმი
                <>
                  <TableCell>{apartment.apartment_number}</TableCell>
                  <TableCell>{apartment.floor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{apartment.total_area} მ²</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(apartment.status)}>
                      {getStatusText(apartment.status, "ka")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {apartment.bedroom_area > 0 && "1 საძინებელი"}
                    {apartment.bedroom2_area > 0 && "+ 1 საძინებელი"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(apartment)}>
                          რედაქტირება
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>სტატუსის შეცვლა</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(apartment.apartment_id, "available")
                          }
                          disabled={apartment.status === "available"}
                        >
                          ხელმისაწვდომი
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(apartment.apartment_id, "sold")
                          }
                          disabled={apartment.status === "sold"}
                        >
                          გაყიდული
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(apartment.apartment_id, "reserved")
                          }
                          disabled={apartment.status === "reserved"}
                        >
                          დაჯავშნილი
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(apartment.apartment_id)}
                          className="text-red-600"
                        >
                          წაშლა
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
  );
};
