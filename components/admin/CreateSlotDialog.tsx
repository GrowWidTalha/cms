import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSlot } from "@/actions/admin.actions";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const slotSchema = z.object({
    day: z.string().min(1, { message: "Day is required" }),
});

type CreateSlotDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSlotCreated: (newSlot: { $id: string; time: string }) => void;
};

export default function CreateSlotDialog({
    isOpen,
    onClose,
    onSlotCreated,
}: CreateSlotDialogProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof slotSchema>>({
        resolver: zodResolver(slotSchema),
        defaultValues: {
            day: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof slotSchema>) => {
        setLoading(true);
        try {
            const newSlot = await createSlot(data.day);
            onSlotCreated(newSlot);
            toast.success("New slot created successfully.");
            form.reset();
            onClose();
        } catch (error) {
            console.error("Failed to create slot:", error);
            toast.error("Failed to create new slot. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Slot</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="day"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Day</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Slot"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
