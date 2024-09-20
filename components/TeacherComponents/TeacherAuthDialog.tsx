"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { getTeacherByEmail } from "@/actions/teacher.actions";
import { Input } from "../ui/input";
import { setCookie } from "cookies-next";
import { getClientSession, getTeacherSession } from "@/lib/teacherSession";

const FormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "The password must be 6 characters.",
    }),
});

export default function TeacherAuthDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const isAuthenticated = getClientSession();
        console.log(isAuthenticated);
        if (!isAuthenticated) {
            setIsOpen(true);
        }
    }, []);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const teacher = await getTeacherByEmail(data.email);
        if (!teacher) {
            setError("Teacher not found");
            return;
        }
        if (teacher.password === data.password) {
            const sessionToken = btoa(
                JSON.stringify({
                    id: teacher.id,
                    email: teacher.email,
                    name: teacher.name,
                    role: "teacher",
                })
            );
            setCookie("client_session", sessionToken, {
                maxAge: 60 * 60 * 24 * 7,
            }); // 7 days
            setIsOpen(false);
            window.location.reload();
            toast.success("Authentication Successful", {
                description: "You have been granted teacher access.",
            });
        } else {
            setError("Incorrect passcode. Please try again.");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Admin Passcode</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Admin Passcode</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                    <FormLabel>Admin Passcode</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
