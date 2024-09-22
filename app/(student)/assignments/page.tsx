import { getAllAssignments } from "@/actions/admin.actions";
import { getAllClassAssignments } from "@/actions/teacher.actions";
import { auth } from "@/auth";
import AdminAssignmentCard from "@/components/StudentComponents/AdminAssignmentCard";
import AssignmentCard from "@/components/StudentComponents/AssignmentCard";
import { AdminAssignment, ClassAssigments } from "@/types/types.appwrite";
import React from "react";

const page = async () => {
    const session = await auth();
    if (!session) return null;
    const ClassAssigments = await getAllClassAssignments(
        session.user.slots.$id
    );
    const adminAssignments = await getAllAssignments(true);
    return (
        <div className="p-6">
            <section>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    Class Assignments
                </h1>
                {ClassAssigments && ClassAssigments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ClassAssigments.map((assignment: ClassAssigments) => (
                            <AssignmentCard
                                assignment={assignment}
                                key={assignment.$id}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No assignments found.</p>
                )}
            </section>
            <section className="mt-10">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    Admin Assignments
                </h1>
                {adminAssignments && adminAssignments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adminAssignments.map((assignment: AdminAssignment) => (
                            <AdminAssignmentCard
                                assignment={assignment}
                                key={assignment.$id}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No assignments found.</p>
                )}
            </section>
        </div>
    );
};

export default page;
