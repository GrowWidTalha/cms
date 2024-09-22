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
import { DateTimePicker } from "../ui/DateTimePicker";
import { Trash2 } from "lucide-react";
import { Switch } from "../ui/switch";
import SubmitButton from "../shared/SubmitButton";
import { createAssignment, updateAssignment } from "@/actions/admin.actions";
import { toast } from "sonner";
import { AdminAssignment } from "@/types/types.appwrite";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const CreateAssignmentSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    startDate: z.date(),
    endDate: z.date(),
    type: z.enum(["assignment", "hackathon"]),
    milestones: z
        .array(
            z.object({
                name: z.string().min(1, "Milestone name is required"),
                description: z
                    .string()
                    .min(1, "Milestone description is required"),
            })
        )
        .min(1, "At least one milestone is required"),
    resources: z
        .array(
            z.object({
                url: z.string().url("Invalid URL"),
                name: z.string().min(1, "Resource name is required"),
            })
        )
        .min(1, "At least one resource is required"),
    isEvaluated: z.boolean(),
    isPublished: z.boolean(),
});

const CreateAssignmentForm = ({
    initialData,
    formType,
    formFor,
}: {
    initialData?: AdminAssignment;
    formType: "create" | "update";
    formFor: "assignment" | "hackathon";
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof CreateAssignmentSchema>>({
        resolver: zodResolver(CreateAssignmentSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            startDate: initialData?.startDate
                ? new Date(initialData.startDate)
                : new Date(),
            endDate: initialData?.endDate
                ? new Date(initialData.endDate)
                : new Date(),
            type: initialData?.type || "assignment",
            milestones: JSON.parse(initialData?.milestones || "[]"),
            resources: JSON.parse(initialData?.resources || "[]"),
            isEvaluated: initialData?.isEvaluated || false,
            isPublished: initialData?.isPublished || false,
        },
    });

    const {
        fields: milestoneFields,
        append: appendMilestone,
        remove: removeMilestone,
    } = useFieldArray({
        control: form.control,
        name: "milestones",
    });

    const {
        fields: resourceFields,
        append: appendResource,
        remove: removeResource,
    } = useFieldArray({
        control: form.control,
        name: "resources",
    });

    const onSubmit = async (values: z.infer<typeof CreateAssignmentSchema>) => {
        setIsLoading(true);
        try {
            const assignmentData = {
                title: values.title,
                description: values.description,
                startDate: values.startDate,
                endDate: values.endDate,
                type: formFor,
                milestones: JSON.stringify(values.milestones),
                resources: JSON.stringify(values.resources),
                isEvaluated: values.isEvaluated,
                isPublished: values.isPublished,
            };

            if (formType === "create") {
                const assignment = await createAssignment(assignmentData);
                if (assignment) {
                    toast.success("Assignment created successfully");
                    form.reset();
                }
            } else {
                const document = await updateAssignment(
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
                <FormField
                    name="startDate"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <DateTimePicker {...field} hourCycle={12} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="endDate"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <DateTimePicker {...field} hourCycle={12} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <Label>Milestones</Label>
                    {milestoneFields.map((field, index) => (
                        <div key={field.id} className="space-y-2 mt-2">
                            <FormField
                                control={form.control}
                                name={`milestones.${index}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={`Milestone ${
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
                                name={`milestones.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={`Milestone ${
                                                    index + 1
                                                } Description`}
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
                                onClick={() => removeMilestone(index)}
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
                        onClick={() =>
                            appendMilestone({ name: "", description: "" })
                        }
                    >
                        Add Milestone
                    </Button>
                </div>
                <div>
                    <Label>Resources</Label>
                    {resourceFields.map((field, index) => (
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
                                onClick={() => removeResource(index)}
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
                        onClick={() => appendResource({ name: "", url: "" })}
                    >
                        Add Resource
                    </Button>
                </div>
                <FormField
                    name="isEvaluated"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <FormLabel className="text-base">
                                Is Evaluated
                            </FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
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

export default CreateAssignmentForm;
