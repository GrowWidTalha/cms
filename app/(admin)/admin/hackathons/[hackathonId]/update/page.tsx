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
    params: { hackathonId },
}: {
    params: { hackathonId: string };
}) => {
    const assignment = await getAssignmentById(hackathonId);
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
                        formFor="hackathon"
                        formType="update"
                        initialData={assignment?.assignment as AdminAssignment}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default UpdatePage;
