import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AssignmentInfoCard = ({
    submitted,
    classAssignment,
}: {
    submitted: number;
    classAssignment?: number;
}) => (
    <Card>
        <CardHeader className="flex items-center justify-between">
            <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid gap-1">
                <div className="text-sm font-medium">
                    Assignments/Hackathons
                </div>
                <div className="text-2xl font-bold">{submitted}</div>
            </div>
            {classAssignment && (
                <div className="grid gap-1">
                    <div className="text-sm font-medium">Class Assignment</div>
                    <div className="text-2xl font-bold">{classAssignment}</div>
                </div>
            )}
        </CardContent>
    </Card>
);

export default AssignmentInfoCard;
