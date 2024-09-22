"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import dynamic from "next/dynamic";
import { Trash2 } from "lucide-react";
import { Switch } from "../ui/switch";
import SubmitButton from "../shared/SubmitButton";
import { toast } from "sonner";
import { ClassAssigments } from "@/types/types.appwrite";
import {
    createClassAssignment,
    updateClassAssignment,
} from "@/actions/teacher.actions";
import Loader from "@/app/loading";
import { getSession } from "next-auth/react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
    ssr: false,
    loading: () => <Loader />,
});

const CreateAssignmentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    resources: z
        .array(
            z.object({
                name: z.string().min(1, "Resource name is required"),
                url: z.string().url("Invalid URL"),
            })
        )
        .min(1, "At least one resource is required"),
    isPublished: z.boolean(),
});

const CreateClassAssignmentForm = ({
    initialData,
    formType,
}: {
    initialData?: ClassAssigments;
    formType: "create" | "update";
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof CreateAssignmentSchema>>({
        resolver: zodResolver(CreateAssignmentSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            resources: initialData?.resources
                ? JSON.parse(initialData.resources)
                : [{ name: "", url: "" }],
            isPublished: initialData?.isPublished || false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "resources",
    });

    const onSubmit = async (values: z.infer<typeof CreateAssignmentSchema>) => {
        const session = await getSession();
        if (!session) return null;
        setIsLoading(true);
        try {
            const assignmentData = {
                title: values.title,
                description: values.description,
                resources: JSON.stringify(values.resources),
                isPublished: values.isPublished,
                teacher: session.user.id,
                classSlot: session.user.slots.$id,
            };

            if (formType === "create") {
                const assignment = await createClassAssignment(assignmentData);
                if (assignment) {
                    toast.success("Class Assignment created successfully");
                    form.reset();
                }
            } else {
                const document = await updateClassAssignment(
                    initialData?.$id as string,
                    assignmentData
                );
                if (document) {
                    toast.success("Assignment updated successfully");
                    form.reset();
                }
            }
        } catch (error) {
            toast.error("Error creating assignment");
            console.log("Error creating assignment", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
            >
                <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="NEXT.js ecommerce website"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl data-color-mode="light">
                                <MDEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <Label>Resources</Label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-2 mt-2">
                            <FormField
                                control={form.control}
                                name={`resources.${index}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={`Resource ${
                                                    index + 1
                                                } Name`}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`resources.${index}.url`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={`Resource ${
                                                    index + 1
                                                } URL`}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => append({ name: "", url: "" })}
                    >
                        Add Resource
                    </Button>
                </div>
                <FormField
                    name="isPublished"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <FormLabel className="text-base">Publish</FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <SubmitButton isLoading={isLoading}>
                    {formType === "create" ? "Create" : "Update"} Assignment
                </SubmitButton>
            </form>
        </Form>
    );
};

export default CreateClassAssignmentForm;
