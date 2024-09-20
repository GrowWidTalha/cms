import { getClassAssignmentById } from "@/actions/teacher.actions";
import CreateClassAssignmentForm from "@/components/TeacherComponents/CreateClassAssignmentForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ClassAssigments } from "@/types/types.appwrite";
import React from "react";

const UpdateAssignmentPage = async ({
    params: { assignmentId },
}: {
    params: { assignmentId: string };
}) => {
    const assignment = await getClassAssignmentById(assignmentId);
    if (!assignment) {
        return <div>Assignment not found</div>;
    }
    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>Update Assignment</CardTitle>
                    <CardDescription>
                        Update the assignment to assign to students
                    </CardDescription>
                </CardHeader>
                <CardContent className="max-w-2xl">
                    <CreateClassAssignmentForm
                        initialData={assignment as ClassAssigments}
                        formType="update"
                    />{" "}
                </CardContent>
            </Card>
        </div>
    );
};

export default UpdateAssignmentPage;
