import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ProgressBar = () => {
    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>My Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <Progress value={50} className="w-full" />
                <div className="text-right mt-2">10/20</div>
            </CardContent>
        </Card>
    );
};

export default ProgressBar;
