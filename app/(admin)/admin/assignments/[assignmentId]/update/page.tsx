import { getAssignmentById } from "@/actions/admin.actions";
import CreateAssignmentForm from "@/components/admin/CreateAssignmentForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AdminAssignment } from "@/types/types.appwrite";
import React from "react";

const UpdatePage = async ({
    params: { assignmentId },
}: {
    params: { assignmentId: string };
}) => {
    const assignment = await getAssignmentById(assignmentId);
    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>Update Assignment</CardTitle>
                    <CardDescription>
                        Update the assignment details
                    </CardDescription>
                </CardHeader>
                <CardContent className="max-w-2xl">
                    <CreateAssignmentForm
                        formFor="assignment"
                        formType="update"
                        initialData={assignment?.assignment as AdminAssignment}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default UpdatePage;
