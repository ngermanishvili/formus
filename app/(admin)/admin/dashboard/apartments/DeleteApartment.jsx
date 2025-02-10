import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export const DeleteApartment = ({ apartmentId }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/apartments?id=${apartmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete apartment");
      }

      toast({
        title: "წარმატება",
        description: "ბინა წარმატებით წაიშალა",
      });

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "შეცდომა",
        description: "ბინის წაშლა ვერ მოხერხდა",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">წაშლა</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>დარწმუნებული ხართ?</AlertDialogTitle>
          <AlertDialogDescription>
            ეს მოქმედება წაშლის ბინას და მასთან დაკავშირებულ ყველა მონაცემს. ეს
            მოქმედება შეუქცევადია.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>გაუქმება</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            წაშლა
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
