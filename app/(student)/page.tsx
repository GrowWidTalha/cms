import {
    getLatestAdminAssignment,
    getThisWeekAssignment,
} from "@/actions/student.actions";
import { auth } from "@/auth";
import AdminAssignmentCard from "@/components/StudentComponents/AdminAssignmentCard";
import AssignmentCard from "@/components/StudentComponents/AssignmentCard";
import { Button } from "@/components/ui/button";
import { AdminAssignment, ClassAssigments } from "@/types/types.appwrite";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

const StudentDashboard = async () => {
    const session = await auth();
    if (!session) return null;

    const weeksAssignment = await getThisWeekAssignment(session.user.slots.$id);
    const latestAdminAssignment = await getLatestAdminAssignment();

    return (
        <div className="p-10 space-y-10">
            {/* This Week's Assignments Section */}
            <div>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    This Week's Assignments
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weeksAssignment && weeksAssignment.length > 0 ? (
                        weeksAssignment.map((assignment) => (
                            <AssignmentCard
                                key={assignment.$id}
                                assignment={assignment as ClassAssigments}
                            />
                        ))
                    ) : (
                        <p className="text-gray-600">
                            No assignments for this week.
                        </p>
                    )}
                </div>
                <div className="mt-8 flex justify-end">
                    <Button variant={"ghost"}>
                        See All Class Assignments{" "}
                        <ChevronRightIcon className="ml-2" />
                    </Button>
                </div>
            </div>

            {/* Latest Admin Assignment Section */}
            <div>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    Latest Admin Assignment
                </h1>
                {latestAdminAssignment ? (
                    <AdminAssignmentCard
                        assignment={latestAdminAssignment as AdminAssignment}
                    />
                ) : (
                    <p className="text-gray-600">
                        No admin assignments available at this moment.
                    </p>
                )}
                <div className="mt-8 flex justify-end">
                    <Button variant={"ghost"}>
                        See All Admin Assignments{" "}
                        <ChevronRightIcon className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
