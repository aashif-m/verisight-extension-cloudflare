import { API } from "@/GlobalContext";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const DeleteAccount = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  //Delete function
  const Delete = async () => {
    try {
      await fetch(API + "/user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('jwt') || "" },
      });
      setOpen(false);
      handleLogout();
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again later.",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-[8.5rem] p-1 align-middle" variant="destructive">
          <Trash2 className="mr-1 w-5 h-5" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-center">
        <DialogHeader>
          <DialogTitle className="text-center">Delete Account</DialogTitle>
        </DialogHeader>
        <Button onClick={Delete} variant="destructive">
          Sure you want to delete your account?
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccount;
