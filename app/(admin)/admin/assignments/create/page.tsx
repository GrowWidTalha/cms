import CreateAssignmentForm from "@/components/admin/CreateAssignmentForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React from "react";

const page = () => {
    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>Create Assignment</CardTitle>
                    <CardDescription>
                        Create a new assignment to assign to students
                    </CardDescription>
                </CardHeader>
                <CardContent className="max-w-2xl">
                    <CreateAssignmentForm formType="create" formFor="assignment" />
                </CardContent>
            </Card>
        </div>
    );
};

export default page;
