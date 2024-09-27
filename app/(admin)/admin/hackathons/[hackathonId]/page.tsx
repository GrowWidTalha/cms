import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { getAssignmentById } from "@/actions/admin.actions";
import StudentDataTable from "@/components/admin/Table/ResponseTable";
import {
    AdminAssignment,
    AdminAssignmentSubmission,
} from "@/types/types.appwrite";

export default async function AssignmentPage({
    params: { hackathonId },
}: {
    params: { hackathonId: string };
}) {
    const result = await getAssignmentById(hackathonId);
    if (!result) {
        return <div>No hackathon found</div>;
    }
    const { assignment, responses } = result;
    if (!assignment || !responses) {
        return <div>Invalid hackathon data</div>;
    }
    console.log(responses);
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Hackathon: {assignment.title}
                </h1>
                <div className="flex items-center space-x-4">
                    <Link
                        href={`/admin/hackathons/${hackathonId}`}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        View Hackathon
                    </Link>
                    <Link
                        href={`/admin/hackathons/${hackathonId}/update`}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        prefetch={false}
                    >
                        Edit
                    </Link>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                            Status:
                        </span>
                        <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                            {assignment.isPublished ? "Published" : "Draft"}
                        </span>
                    </div>
                    {/* TODO: Add switch to toggle hackathon status */}
                    <Switch
                        id="publish-switch"
                        name="publish-switch"
                        defaultChecked
                        className="relative inline-flex h-6 w-11 items-center rounded-full"
                    >
                        <span className="sr-only">Publish</span>
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                    </Switch>
                </div>
            </div>
            <StudentDataTable
                data={responses.documents as AdminAssignmentSubmission[]}
                assignment={assignment as AdminAssignment}
            />
        </div>
    );
}
