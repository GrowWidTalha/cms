import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllStudents } from "@/actions/admin.actions";
import StudentTable from "@/components/admin/Table/StudentTable";
import { Student } from "@/types/types.appwrite";
import { auth } from "@/auth";

export default async function StudentDataPage() {
    const session = await auth();
    if (!session) return;
    const result = await getAllStudents(session.user.slots.$id);
    if (!result) {
        return <div>No students found</div>;
    }
    return (
        <div className="container mx-auto py-10">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Student Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">
                        Total Students: {result?.total}
                    </p>
                </CardContent>
            </Card>
            <StudentTable
                data={result?.students as Student[]}
                teacherDashboard
            />
        </div>
    );
}
