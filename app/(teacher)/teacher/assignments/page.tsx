import { getAllClassAssignments } from "@/actions/teacher.actions";
import { auth } from "@/auth";
import ClassAssignmentCard from "@/components/TeacherComponents/ClassAssingmentCard";
import { Button } from "@/components/ui/button";
import { ClassAssigments } from "@/types/types.appwrite";
import Link from "next/link";

export default async function TeacherAssignmentsPage() {
    const session = await auth();
    if (!session?.user?.slots?.$id) {
        return <div className="ml-32">No slot found</div>;
    }
    const data: ClassAssigments[] | undefined = await getAllClassAssignments(
        session?.user.slots.$id
    );
    console.log(data);
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Assignments</h1>
                <Button asChild size="sm">
                    <Link href={"/teacher/assignments/create"}>
                        Create Assignment
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data?.map((assignment: ClassAssigments) => (
                    <ClassAssignmentCard
                        key={assignment.$id}
                        assignment={assignment}
                    />
                ))}
            </div>
        </div>
    );
}
