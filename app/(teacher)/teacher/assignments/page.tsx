import { getAllClassAssignments } from "@/actions/teacher.actions";
import AssignmentCard from "@/components/admin/AssignmentCard";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { ClassAssigments } from "@/types/types.appwrite";
import Link from "next/link";

export default async function TeacherAssignmentsPage() {
    const teacher = await getSession();
    console.log(teacher);
    // if (!teacher?.slot) {
    //     return <div>No slot found</div>;
    // }
    // const data: ClassAssigments[] | undefined = await getAllClassAssignments(
    //     teacher.slot
    // );
    // const assignments = data?.filter(
    //     (assignment) => assignment.type === "assignment"
    // );
    // if (!assignments) {
    //     return <div>No assignments found</div>;
    // }
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Assignments</h1>
                <Button asChild size="sm">
                    <Link href={"/admin/assignments/create"}>
                        Create Assignment
                    </Link>
                </Button>
            </div>
            {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {assignments?.map((assignment: ClassAssigments) => (
                    <AssignmentCard
                        type="assignment"
                        key={assignment.$id}
                        assignment={assignment}
                    />
                ))}
            </div> */}
        </div>
    );
}
