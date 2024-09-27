import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StudentInfoCard from "@/components/StudentComponents/StudentInfoCard";
import AssignmentInfoCard from "@/components/StudentComponents/AssignmentsInfoCard";
import { getStudentById } from "@/actions/admin.actions";
import StudentAssignmentTable from "@/components/StudentComponents/columns";
import { auth } from "@/auth";
import { getClassAssignmentResponses } from "@/actions/student.actions";
import {
    DataTable,
    columns,
} from "@/components/StudentComponents/ClassAssignmentResponsesTable";

export default async function StudentInfoPage() {
    const session = await auth();
    if (!session) return null;
    const student = await getStudentById(session.user.id);
    const classAssignmentResponses = await getClassAssignmentResponses(
        session.user.id
    );

    if (!student) {
        return <div>Student not found</div>;
    }

    return (
        <div className="flex flex-col gap-8 p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StudentInfoCard student={student?.student} />
                <AssignmentInfoCard
                    submitted={student?.responses.length}
                    classAssignment={classAssignmentResponses.length}
                />
            </div>
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                    <StudentAssignmentTable submissions={student.responses} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Class Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={classAssignmentResponses}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
