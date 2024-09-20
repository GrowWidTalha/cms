import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StudentInfoCard from "@/components/StudentComponents/StudentInfoCard";
import AssignmentInfoCard from "@/components/StudentComponents/AssignmentsInfoCard";
import { getStudentById } from "@/actions/admin.actions";
import StudentAssignmentTable from "@/components/StudentComponents/columns";

export default async function StudentInfoPage({
    params,
}: {
    params: { studentId: string };
}) {
    // @ts-ignore
    const { student, responses } = await getStudentById(params.studentId);
    if (!student) {
        return <div>No student found</div>;
    }

    return (
        <div className="flex flex-col gap-8 p-12 sm:p-12 md:p-10 lg:p-16">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StudentInfoCard student={student} />
                <AssignmentInfoCard
                    submitted={student?.responses.length}
                    pending={student?.responses.length}
                />
            </div>
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                    <StudentAssignmentTable submissions={responses} />
                </CardContent>
            </Card>
        </div>
    );
}
