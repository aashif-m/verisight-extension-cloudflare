import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { API } from "@/GlobalContext"

const Register = () => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const FormSchema = z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters long",
        }),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters long",
        }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const response = await fetch(API + "/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                console.error(response);
                toast({
                    title: "An error occurred",
                    description: "Account with that username already exists",
                    variant: "destructive",
                });
                return;
            }
    
            const responseData = await response.json();
            localStorage.setItem("jwt", responseData.token);
            toast({
                title: "Login successful",
                description: "You have been logged in successfully",
            });
            setTimeout(() => {
                setOpen(false);
            }, 2000);
        } catch (error) {
            console.error(error);
            toast({
                title: "An error occurred",
                description: "An error occurred while logging in",
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="font-bold py-2 px-4">
                    <span>Register</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Register</DialogTitle>
                    <DialogDescription>Enter your username and password below to create an account</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" {...field} type="password"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-2 w-full">Register</Button>
                    </form>
                </Form>
                <Toaster />
            </DialogContent>
        </Dialog>
    )
}

export default Register