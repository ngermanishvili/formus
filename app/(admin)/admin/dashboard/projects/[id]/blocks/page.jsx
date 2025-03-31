"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ProjectBlocksPage({ params }) {
  const { id } = params;
  const [blocks, setBlocks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [newBlock, setNewBlock] = useState({ block_name: "" });
  const [buttonLoading, setButtonLoading] = useState(false);
  const { toast } = useToast();

  // Fetch project details and blocks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch project details
        const projectResponse = await fetch(`/api/projects/${id}`);
        if (!projectResponse.ok) throw new Error("Failed to fetch project");
        const projectData = await projectResponse.json();
        setProject(projectData.data);

        // Fetch building blocks
        const blocksResponse = await fetch(`/api/building_blocks`);
        if (!blocksResponse.ok) throw new Error("Failed to fetch blocks");
        const blocksData = await blocksResponse.json();
        setBlocks(blocksData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "შეცდომა",
          description: "მონაცემების ჩატვირთვისას დაფიქსირდა შეცდომა",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleAddBlock = async () => {
    if (!newBlock.block_name.trim()) {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: "გთხოვთ, შეიყვანოთ ბლოკის სახელი",
      });
      return;
    }

    try {
      setButtonLoading(true);
      const response = await fetch(`/api/building_blocks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ block_name: newBlock.block_name }),
      });

      if (!response.ok) throw new Error("Failed to add block");

      const { data } = await response.json();
      setBlocks((prev) => [...prev, data]);
      setNewBlock({ block_name: "" });
      setIsAddDialogOpen(false);

      toast({
        title: "წარმატება",
        description: "ბლოკი წარმატებით დაემატა",
      });
    } catch (error) {
      console.error("Error adding block:", error);
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: "ბლოკის დამატებისას დაფიქსირდა შეცდომა",
      });
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDeleteBlock = async () => {
    if (!selectedBlockId) return;

    try {
      setButtonLoading(true);
      const response = await fetch(`/api/building_blocks/${selectedBlockId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete block");

      setBlocks((prev) =>
        prev.filter((block) => block.block_id !== selectedBlockId)
      );
      setIsDeleteDialogOpen(false);
      setSelectedBlockId(null);

      toast({
        title: "წარმატება",
        description: "ბლოკი წარმატებით წაიშალა",
      });
    } catch (error) {
      console.error("Error deleting block:", error);
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: "ბლოკის წაშლისას დაფიქსირდა შეცდომა",
      });
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {project?.title_ge} - ბლოკები
              </h2>
              <p className="text-gray-500 mt-1">
                ბლოკების მართვა ყველა პროექტისთვის
              </p>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle size={16} />
              დაამატე ბლოკი
            </Button>
          </div>

          {blocks.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-500">ბლოკები არ არის დამატებული</p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="mt-4"
                variant="outline"
              >
                დაამატე პირველი ბლოკი
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blocks.map((block) => (
                <Card key={block.block_id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">
                          ბლოკი {block.name}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedBlockId(block.block_id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Block Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ახალი ბლოკის დამატება</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="block-name">ბლოკის სახელი</Label>
              <Input
                id="block-name"
                placeholder="მაგ: A, B, C..."
                value={newBlock.block_name}
                onChange={(e) =>
                  setNewBlock((prev) => ({
                    ...prev,
                    block_name: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              გაუქმება
            </Button>
            <Button
              onClick={handleAddBlock}
              disabled={buttonLoading || !newBlock.block_name.trim()}
            >
              {buttonLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  დამატება...
                </>
              ) : (
                "დაამატე"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Block Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ბლოკის წაშლა</DialogTitle>
          </DialogHeader>
          <p>ნამდვილად გსურთ ამ ბლოკის წაშლა?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              გაუქმება
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBlock}
              disabled={buttonLoading}
            >
              {buttonLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  იშლება...
                </>
              ) : (
                "წაშლა"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
