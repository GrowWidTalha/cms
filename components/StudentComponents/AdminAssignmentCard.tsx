import { AdminAssignment } from "@/types/types.appwrite";
import { format, differenceInDays } from "date-fns";
import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";

const AdminAssignmentCard = ({
    assignment,
}: {
    assignment: AdminAssignment;
}) => {
    // Format the createdAt date
    const formattedCreatedAt = format(new Date(assignment.$createdAt), "PPP");

    // Calculate the difference in days for hackathons
    const startDate = new Date(assignment.startDate);
    const daysUntilStart = differenceInDays(startDate, new Date());
    const isHackathon = assignment.type === "hackathon";

    return (
        <Card className=" space-y-4 border border-gray-200 rounded-lg shadow-lg">
            <CardHeader className="flex items-start justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800">
                    {assignment.title}
                </CardTitle>
                <Badge className="capitalize">{assignment.type}</Badge>
            </CardHeader>

            <CardContent className="space-y-2">
                {/* Conditional rendering based on assignment type */}
                {isHackathon ? (
                    <div className="font-medium">
                        Starting in:{" "}
                        <span className="font-normal">
                            {daysUntilStart > 0
                                ? `${daysUntilStart} days`
                                : "Today!"}
                        </span>
                    </div>
                ) : (
                    <div className="font-medium">
                        Assigned On:{" "}
                        <span className="font-normal">
                            {formattedCreatedAt}
                        </span>
                    </div>
                )}

                {/* Status Badges */}
                <div className="flex space-x-2 mt-2">
                    {/* Published Badge */}
                    <span
                        className={`text-xs font-semibold py-1 px-3 rounded-full ${
                            assignment.isPublished
                                ? "bg-green-200 text-green-800"
                                : "bg-yellow-200 text-yellow-800"
                        }`}
                        aria-label={
                            assignment.isPublished ? "Published" : "Draft"
                        }
                    >
                        {assignment.isPublished ? "Published" : "Draft"}
                    </span>

                    {/* Evaluated Badge */}
                    <span
                        className={`text-xs font-semibold py-1 px-3 rounded-full ${
                            assignment.isEvaluated
                                ? "bg-blue-200 text-blue-800"
                                : "bg-gray-200 text-gray-800"
                        }`}
                        aria-label={
                            assignment.isEvaluated
                                ? "Evaluated"
                                : "Not Evaluated"
                        }
                    >
                        {assignment.isEvaluated ? "Evaluated" : "Not Evaluated"}
                    </span>
                </div>
            </CardContent>

            {/* View More Button */}
            <CardFooter className="mt-4 flex justify-end">
                <Button
                    variant="ghost"
                    asChild
                    className="flex items-center"
                    aria-label="View more details"
                >
                    <Link
                        href={`/assignment/${assignment.$id}?type=${
                            assignment.type === "hackathon"
                                ? "hackathon"
                                : "assignment"
                        }`}
                    >
                        View More
                        <ChevronRightIcon className="ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default AdminAssignmentCard;
