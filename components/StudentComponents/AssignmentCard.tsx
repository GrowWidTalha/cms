import { ClassAssigments } from "@/types/types.appwrite";
import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Calendar, ChevronRightIcon, PersonStandingIcon } from "lucide-react";
import { format } from "date-fns"; // To format the date
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";

const AssignmentCard = ({ assignment }: { assignment: ClassAssigments }) => {
    // Format the createdAt date
    const formattedDate = format(new Date(assignment.$createdAt), "PPP");

    return (
        <Card className="mt-6 border rounded-lg shadow-md ">
            <CardHeader className="flex justify-between flex-row items-center">
                <CardTitle className="text-xl font-semibold text-gray-800">
                    {assignment.title}
                </CardTitle>
                <Badge className="rounded-full" variant={"secondary"}>
                    {assignment.isEvaluated ? "Evaluated" : "Not Evaluated"}
                </Badge>
            </CardHeader>
            <CardContent className="mt-2">
                <div className="flex items-center space-x-2 text-gray-600">
                    <PersonStandingIcon className="w-4 h-4" />
                    <span className="text-sm">
                        Assigned By: {assignment.teacher.name}
                    </span>
                </div>
                <div className="flex items-center space-x-2 mt-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                        Assigned On: {formattedDate}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button variant={"ghost"} asChild>
                    <Link
                        href={`/assignment/${assignment.$id}?type=classAssignment`}
                    >
                        View Assignment <ChevronRightIcon className="ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default AssignmentCard;
