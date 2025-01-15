"use client";
import React from "react";
import { TopBar } from "@/components/admin/TopBar";
import { BlockSelector } from "@/components/admin/BlockSelector";
import { ApartmentList } from "@/components/admin/ApartmentTable/ApartmentList";
import { AddApartmentDialog } from "@/components/admin/Dialogs/AddApartmentDialog";
import { TableFilters } from "@/components/admin/ApartmentTable/TableFilters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

// ჰუკების იმპორტი
import { useBlocks } from "@/hooks/useBlocks";
import { useFilters } from "@/hooks/useFilters";
import { useApartments } from "@/hooks/useApartments";

export default function AdminPanel() {
  // ბლოკების მართვის ჰუკი
  const { blocks, selectedBlock, setSelectedBlock } = useBlocks();

  // ბინების მართვის ჰუკი
  const {
    apartments,
    loading,
    error,
    addApartment,
    updateApartment,
    deleteApartment,
    updateApartmentStatus,
    notification,
    setNotification,
    editingApartment,
    setEditingApartment,
  } = useApartments(selectedBlock);

  // ფილტრების ჰუკი
  const {
    searchTerm,
    filterFloor,
    filteredApartments,
    setSearchTerm,
    setFilterFloor,
    stats,
  } = useFilters(apartments);

  // დიალოგის მდგომარეობა
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  // ბინის დამატების ჰენდლერი
  const handleAddApartment = async (data) => {
    try {
      await addApartment({ ...data, block_id: selectedBlock });
      setIsAddDialogOpen(false);
      setNotification({
        type: "success",
        message: "ბინა წარმატებით დაემატა",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "შეცდომა ბინის დამატებისას",
      });
    }
  };

  // ბინის წაშლის ჰენდლერი
  const handleDeleteApartment = async (id) => {
    if (window.confirm("ნამდვილად გსურთ ბინის წაშლა?")) {
      try {
        await deleteApartment(id);
        setNotification({
          type: "success",
          message: "ბინა წარმატებით წაიშალა",
        });
      } catch (error) {
        setNotification({
          type: "error",
          message: "შეცდომა ბინის წაშლისას",
        });
      }
    }
  };

  // სტატუსის განახლების ჰენდლერი
  const handleStatusChange = async (id, status) => {
    try {
      await updateApartmentStatus(id, status);
      setNotification({
        type: "success",
        message: "სტატუსი წარმატებით განახლდა",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "შეცდომა სტატუსის განახლებისას",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="pt-20 px-6 pb-6 mt-[120px]">
        {/* შეტყობინებები */}
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

        {/* ბლოკების არჩევა */}
        <BlockSelector
          blocks={blocks}
          selectedBlock={selectedBlock}
          onSelect={setSelectedBlock}
          onAddNew={() => setIsAddDialogOpen(true)}
        />

        {/* ბინების სია */}
        {selectedBlock && (
          <Card>
            <CardContent className="p-6">
              {/* სტატისტიკა */}
              {stats && (
                <div className="mb-6 grid grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                      სულ ბინები
                    </h3>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                      ხელმისაწვდომი
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.byStatus.available || 0}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                      გაყიდული
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.byStatus.sold || 0}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                      საშუალო ფართი
                    </h3>
                    <p className="text-2xl font-bold">{stats.averageArea} მ²</p>
                  </div>
                </div>
              )}

              {/* ფილტრები */}
              <TableFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterFloor={filterFloor}
                onFilterChange={setFilterFloor}
                floors={apartments.map((apt) => apt.floor)}
              />

              {/* ბინების ცხრილი */}
              {loading ? (
                <div className="text-center py-10">იტვირთება...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-600">{error}</div>
              ) : (
                <ApartmentList
                  apartments={filteredApartments}
                  onEdit={setEditingApartment}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteApartment}
                  editingApartment={editingApartment}
                  setEditingApartment={setEditingApartment}
                  onSaveEdit={updateApartment}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* ბინის დამატების დიალოგი */}
        <AddApartmentDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddApartment}
        />
      </div>
    </div>
  );
}
