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
    title: z.string().min(1),
    description: z.string().min(1),
    resources: z.array(z.string()).min(1),
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
            resources: initialData?.resources || [],
            isPublished: initialData?.isPublished || false,
        },
    });

    // Specify the type for resourcesArray
    const resourcesArray = useFieldArray<
        z.infer<typeof CreateAssignmentSchema>
    >({
        control: form.control,
        // @ts-ignore
        name: "resources",
    });

    const onSubmit = async (values: z.infer<typeof CreateAssignmentSchema>) => {
        const session = await getSession();
        if (!session) return null;
        setIsLoading(true);
        try {
            if (formType === "create") {
                const assignnment = {
                    title: values.title,
                    description: values.description,
                    resources: values.resources,
                    isPublished: values.isPublished,
                    teacher: session.user.id,
                    classSlot: session.user.slots.$id,
                };
                const assignment = await createClassAssignment(assignnment);
                if (assignment) {
                    toast.success("Class Assignment created successfully");
                    form.reset();
                }
            } else {
                const assignment = {
                    title: values.title,
                    description: values.description,
                    resources: values.resources,
                    isPublished: values.isPublished,
                    teacher: session.user.id,
                    classSlot: session.user.slots.$id,
                };
                const document = await updateClassAssignment(
                    initialData?.$id as string,
                    assignment
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
                    {resourcesArray.fields.map((field, index) => (
                        <FormField
                            control={form.control}
                            key={field.id}
                            name={`resources.${index}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Input
                                                {...field}
                                                placeholder={`Resource ${
                                                    index + 1
                                                }`}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    resourcesArray.remove(index)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => resourcesArray.append({ resource: "" })} // Updated to append an object
                    >
                        Add Resources
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
