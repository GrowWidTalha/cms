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
import { Plus, Trash2 } from "lucide-react";
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
    milestones: z.array(z.string()).min(1),
    resources: z.array(z.string()).min(1),
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
            milestones: initialData?.milestones || [],
            resources: initialData?.resources || [],
            isEvaluated: initialData?.isEvaluated || false,
            isPublished: initialData?.isPublished || false,
        },
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        // @ts-ignore
        name: "milestones",
    });
    const resourcesArray = useFieldArray({
        control: form.control,
        // @ts-ignore
        name: "resources",
    });

    const onSubmit = async (values: z.infer<typeof CreateAssignmentSchema>) => {
        setIsLoading(true);
        try {
            if (formType === "create") {
                const assignnment = {
                    title: values.title,
                    description: values.description,
                    startDate: values.startDate,
                    endDate: values.endDate,
                    type: formFor,
                    milestones: values.milestones,
                    resources: values.resources,
                    isEvaluated: values.isEvaluated,
                    isPublished: values.isPublished,
                };
                const assignment = await createAssignment(assignnment);
                if (assignment) {
                    toast.success("Assignment created successfully");
                    form.reset();
                }
            } else {
                const assignment = {
                    title: values.title,
                    description: values.description,
                    startDate: values.startDate,
                    endDate: values.endDate,
                    type: formFor,
                    milestones: values.milestones,
                    resources: values.resources,
                    isEvaluated: values.isEvaluated,
                    isPublished: values.isPublished,
                };
                const document = await updateAssignment(
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
                className="space-y-4 w-full "
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
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <DateTimePicker {...field} hourCycle={12} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <Label>Milestones</Label>
                    {fields.map((field, index) => (
                        <FormField
                            control={form.control}
                            key={field.id}
                            name={`milestones.${index}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Input
                                                {...field}
                                                placeholder={`Milestone ${
                                                    index + 1
                                                }`}
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
                        onClick={() => append("")}
                    >
                        Add Milestones
                    </Button>
                </div>
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
                        onClick={() => resourcesArray.append("")}
                    >
                        Add Resources
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
