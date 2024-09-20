import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Student } from "@/types/types.appwrite";

const StudentInfoCard = ({ student }: { student: Student }) => (
    <Card>
        <CardHeader className="flex items-center justify-between">
            <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="border">
                    <AvatarImage
                        src="/placeholder-user.jpg"
                        alt="Student Avatar"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <div className="text-lg font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">
                        Roll #: {student.rollNumber}
                    </div>
                </div>
            </div>
            <div className="grid gap-1">
                <div className="text-sm font-medium">Class Timing</div>
                <div className="text-sm text-muted-foreground">
                    {student.slot.time}
                </div>
            </div>
        </CardContent>
    </Card>
);

export default StudentInfoCard;
