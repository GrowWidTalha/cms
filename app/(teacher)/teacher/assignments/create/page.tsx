import React from "react";
import CreateClassAssignmentForm from "@/components/TeacherComponents/CreateClassAssignmentForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
const CreateAssignmentPage = () => {
    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <Card>
                <CardHeader>
                    <CardTitle>Create Assignment</CardTitle>
                    <CardDescription>
                        Create a new assignment to assign to students
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-w-3xl">
                    <CreateClassAssignmentForm formType="create" />
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateAssignmentPage;
