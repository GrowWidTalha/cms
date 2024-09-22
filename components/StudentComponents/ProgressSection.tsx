import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";

interface ProgressSectionProps {
    studentName: string;
    studentYear: string;
    overallProgress: number;
    assignmentsCompleted: number;
    hackathonParticipation: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
    studentName,
    studentYear,
    overallProgress,
    assignmentsCompleted,
    hackathonParticipation,
}) => {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                        <AvatarImage
                            src="/placeholder-avatar.jpg"
                            alt="Student"
                        />
                        <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{studentName}</h3>
                        <p className="text-sm text-gray-500">{studentYear}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                                Overall Progress
                            </span>
                            <span className="text-sm font-medium">
                                {overallProgress}%
                            </span>
                        </div>
                        <Progress value={overallProgress} className="w-full" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                                Assignments Completed
                            </span>
                            <span className="text-sm font-medium">
                                {assignmentsCompleted}%
                            </span>
                        </div>
                        <Progress
                            value={assignmentsCompleted}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                                Hackathon Participation
                            </span>
                            <span className="text-sm font-medium">
                                {hackathonParticipation}%
                            </span>
                        </div>
                        <Progress
                            value={hackathonParticipation}
                            className="w-full"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProgressSection;
