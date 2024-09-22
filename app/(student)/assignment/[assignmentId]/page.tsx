import { getAssignmentAndResponsesById } from "@/actions/student.actions";
import { auth } from "@/auth";
import AssignmentDetails from "@/components/StudentComponents/AssignmentDetails";
import React from "react";

const page = async ({
    params: { assignmentId },
    searchParams,
}: {
    params: { assignmentId: string };
    searchParams: { type: "assignment" | "hackathon" | "classAssignment" };
}) => {
    const session = await auth();
    if (!session) {
        return (
            <div>
                <p>You must be logged in to view this page.</p>
            </div>
        );
    }
    const assignment = await getAssignmentAndResponsesById(
        assignmentId,
        searchParams.type,
        session.user.id
    );
    if (!assignment) {
        return <div>No assignment found</div>;
    }
    return (
        <AssignmentDetails
            responses={assignment.response}
            assignment={assignment.assignment}
            session={session}
            type={searchParams.type}
        />
    );
};

export default page;
