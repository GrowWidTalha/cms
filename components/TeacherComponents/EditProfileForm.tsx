"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/types/types.appwrite";
import { updateTeacher } from "@/actions/admin.actions";
import { toast } from "sonner";
import SubmitButton from "../shared/SubmitButton";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

export default function TeacherProfile({
    teacherData,
}: {
    teacherData: Teacher;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setisLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: teacherData.password,
            email: teacherData.email,
            name: teacherData.name,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setisLoading(true);
        try {
            const data = {
                name: values.name,
                email: values.email,
                password: values.password,
                slot: teacherData.slots.$id,
            };
            const teacher = await updateTeacher(teacherData.$id, data);
            if (teacher) {
                setIsEditing(false);
                toast.success("Information updated successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error("Someting went wrong");
            setIsEditing(false);
        }
        setisLoading(false);
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Teacher Profile</CardTitle>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        {isEditing ? (
                                            <Input {...field} />
                                        ) : (
                                            <div className="p-2 border rounded-md">
                                                {teacherData.name}
                                            </div>
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        {isEditing ? (
                                            <Input {...field} type="email" />
                                        ) : (
                                            <div className="p-2 border rounded-md">
                                                {teacherData.email}
                                            </div>
                                        )}
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
                                        {isEditing ? (
                                            <Input {...field} type="password" />
                                        ) : (
                                            <div className="p-2 border rounded-md">
                                                ********
                                            </div>
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {isEditing && (
                            <SubmitButton isLoading={isLoading}>
                                Update
                            </SubmitButton>
                        )}
                        {!isEditing && (
                            <Button
                                type="button"
                                onClick={() => {
                                    console.log("clicked");
                                    setIsEditing(true);
                                }}
                            >
                                Edit
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
