import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const HackathonsInfoCard = ({
    participated,
    milestonesAchieved,
}: {
    participated: number;
    milestonesAchieved: number;
}) => (
    <Card>
        <CardHeader className="flex items-center justify-between">
            <CardTitle>Hackathons</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid gap-1">
                <div className="text-sm font-medium">Participated</div>
                <div className="text-2xl font-bold">{participated}</div>
            </div>
            <div className="grid gap-1">
                <div className="text-sm font-medium">Milestones Achieved</div>
                <div className="text-2xl font-bold">{milestonesAchieved}</div>
            </div>
        </CardContent>
    </Card>
);

export default HackathonsInfoCard;
