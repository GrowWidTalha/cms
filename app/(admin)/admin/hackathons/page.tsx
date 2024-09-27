import { getAllAssignments } from "@/actions/admin.actions";
import AssignmentCard from "@/components/admin/AssignmentCard";
import { Button } from "@/components/ui/button";
import { AdminAssignment } from "@/types/types.appwrite";
import Link from "next/link";

export default async function Component() {
    const data: AdminAssignment[] | undefined = await getAllAssignments();
    const hackathons = data?.filter(
        (assignment) => assignment.type === "hackathon"
    );
    if (!hackathons) {
        return <div>No hackathons found</div>;
    }
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Hackathons</h1>
                <Button asChild size="sm">
                    <Link href={"/admin/hackathons/create"}>
                        Create Hackathon
                    </Link>
                </Button>
            </div>
            {hackathons.length === 0 ? (
                <div className="text-center text-sm text-gray-500">
                    No assignments found
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {hackathons?.map((hackathon: AdminAssignment) => (
                        <AssignmentCard
                            type="hackathon"
                            key={hackathon.$id}
                            assignment={hackathon}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
