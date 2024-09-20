import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AssignmentInfoCard = ({ submitted }: { submitted: number }) => (
    <Card>
        <CardHeader className="flex items-center justify-between">
            <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid gap-1">
                <div className="text-sm font-medium">Submitted</div>
                <div className="text-2xl font-bold">{submitted}</div>
            </div>
            {/* <div className="grid gap-1">
                <div className="text-sm font-medium">Pending</div>
                <div className="text-2xl font-bold">{pending}</div>
            </div> */}
        </CardContent>
    </Card>
);

export default AssignmentInfoCard;
