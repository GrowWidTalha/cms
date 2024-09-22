"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    createTeacher,
    getSlots,
    updateTeacher,
} from "@/actions/admin.actions";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import SubmitButton from "../shared/SubmitButton";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import CreateSlotDialog from "./CreateSlotDialog";
import { Teacher } from "@/types/types.appwrite";

const teacherSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    slot: z.string().min(1, { message: "Slot is required" }),
});

export default function CreateTeacherForm({
    setOpen,
    teacher,
    formType,
}: {
    setOpen: (open: boolean) => void;
    teacher?: Teacher;
    formType: "create" | "update";
}) {
    const [slots, setSlots] = useState<{ $id: string; time: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreatingSlot, setIsCreatingSlot] = useState(false);

    const form = useForm<z.infer<typeof teacherSchema>>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            name: teacher?.name || "",
            email: teacher?.email || "",
            password: teacher?.password || "",
            slot: teacher?.slots.$id || "",
        },
    });

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const fetchedSlots = await getSlots();
                setSlots(fetchedSlots);
            } catch (error) {
                console.error("Failed to fetch slots:", error);
                toast.error("Failed to load slots. Please try again.");
            }
        };
        fetchSlots();
    }, []);

    const onSubmit = async (data: z.infer<typeof teacherSchema>) => {
        setLoading(true);
        try {
            if (formType === "create") {
                const response = await createTeacher(data);
                if (response) {
                    setOpen(false);
                    toast.success("Teacher created successfully.");
                    form.reset();
                }
            } else {
                if (!teacher) {
                    return;
                }
                const response = await updateTeacher(teacher.$id, {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    slot: data.slot,
                });
                if (response) {
                    setOpen(false);
                    toast.success("Teacher updated successfully.");
                    form.reset();
                }
            }
        } catch (error) {
            console.error("Failed to create teacher:", error);
            toast.error("Failed to create teacher. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewSlot = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsCreatingSlot(true);
    };

    const handleNewSlotCreated = (newSlot: { $id: string; time: string }) => {
        setSlots((prevSlots) => [...prevSlots, newSlot]);
        form.setValue("slot", newSlot.$id);
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                                    <Input {...field} type="email" />
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
                                <FormLabel>Temporary Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slot"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slot</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a slot" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {slots.map((slot) => (
                                                <SelectItem
                                                    key={slot.$id}
                                                    value={slot.$id}
                                                >
                                                    {slot.time}
                                                </SelectItem>
                                            ))}
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start"
                                                onClick={handleCreateNewSlot}
                                            >
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Create new slot
                                            </Button>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SubmitButton isLoading={loading}>
                        Create Teacher
                    </SubmitButton>
                </form>
            </Form>

            <CreateSlotDialog
                isOpen={isCreatingSlot}
                onClose={() => setIsCreatingSlot(false)}
                onSlotCreated={handleNewSlotCreated}
            />
        </div>
    );
}
