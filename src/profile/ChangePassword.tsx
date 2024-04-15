import { API } from "@/GlobalContext";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { LoaderCircle } from "lucide-react";

const FormSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Password cannot be empty.",
  }),
  newPassword: z.string().min(6, {
    message: "New Password must be at least 6 characters.",
  }),
});

const ChangePassword = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  function delay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const response = await fetch(
      `${API}/user/password`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    );
  
    return response.ok;
  };
  
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    let success = false;
  
    try {
      success = await changePassword(data.currentPassword, data.newPassword);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  
    const toastDescription = success ? "Password changed successfully." : "Error changing password.";
    const toastVariant = success ? "default" : "destructive";
  
    toast({ variant: toastVariant, description: toastDescription });
    await delay(1000);
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-[8.5rem] p-1 align-middle" variant="outline">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your current password here"
                        className="resize-none h-8"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your new password here"
                        className="resize-none h-8"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              {loading ? (
                <Button disabled>
                  <LoaderCircle className="animate-spin" />
                  Add note
                </Button>
              ) : (
                <Button type="submit">Change Password</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
        <Toaster />
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
