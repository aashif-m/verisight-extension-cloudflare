import { API, useGlobalContext } from "@/GlobalContext";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogDescription,
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { LoaderCircle } from "lucide-react";

const FormSchema = z.object({
  usernote: z.string().min(1, {
    message: "User note cannot be empty.",
  }),
});

const UserNoteAdd = () => {
  const { article, setNotes } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchNotes = async () => {
    await fetch(API + "/note/" + article.id, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('jwt') || "" },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotes(data);
      });
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      usernote: "",
    },
  });

  function delay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const response = await fetch(API + "/note", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('jwt') || "" },
        body: JSON.stringify({
          link: article.link,
          note: data.usernote
        }),
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          description: "Error adding note.",
        });
        await delay(1000);
      } else {
        await fetchNotes();
        toast({
          description: "Note added successfully.",
        });
        await delay(1000);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error adding note.",
      });
      await delay(1000);
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-[8.5rem]">Add user note</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add User Note</DialogTitle>
              <DialogDescription>
                Add a note to the article with additional context
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="usernote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="User note adding additional context to the article."
                        className="resize-none h-72"
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
                  <LoaderCircle className="animate-spin mr-1" />
                  Add note
                </Button>
              ) : (
                <Button type="submit">Add note</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
        <Toaster />
      </DialogContent>
    </Dialog>
  );
};

export default UserNoteAdd;
