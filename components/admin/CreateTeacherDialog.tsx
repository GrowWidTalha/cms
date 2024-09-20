"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import CreateTeacherForm from "./CreateTeacherForm";

const CreateTeacherDialog = () => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button>Create Teacher</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Teacher</DialogTitle>
                </DialogHeader>
                <CreateTeacherForm formType="create" setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
};

export default CreateTeacherDialog;
