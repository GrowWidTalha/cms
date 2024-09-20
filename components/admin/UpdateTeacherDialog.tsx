import { Teacher } from "@/types/types.appwrite";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CreateTeacherForm from "./CreateTeacherForm";

const UpdateTeacherDialog = ({
    teacher,
    children,
}: {
    teacher: Teacher;
    children: React.ReactNode;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Teacher</DialogTitle>
                    <DialogDescription>
                        Update the teacher details
                    </DialogDescription>
                </DialogHeader>
                <CreateTeacherForm
                    formType="update"
                    setOpen={setOpen}
                    teacher={teacher}
                />
            </DialogContent>
        </Dialog>
    );
};

export default UpdateTeacherDialog;
