import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminAssignment } from "@/types/types.appwrite";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import {
    CalendarIcon,
    ClipboardCheckIcon,
    EyeIcon,
    FilePenIcon,
} from "lucide-react";

export default function AssignmentCard({
    type,
    assignment,
}: {
    type: "assignment" | "hackathon";
    assignment: AdminAssignment;
}) {
    return (
        <Card className="w-full max-w-md p-6 bg-white border border-muted rounded-lg">
            <div className="flex flex-col gap-5 h-full">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold">
                        {assignment.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                            Start:{" "}
                            {formatDateTime(assignment.startDate).dateTime}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                            End: {formatDateTime(assignment.endDate).dateTime}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClipboardCheckIcon className="w-4 h-4" />
                        <span>
                            {assignment.isPublished ? "Published" : "Draft"}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="ghost" size="sm">
                            <Link
                                href={`/admin/${
                                    type === "assignment"
                                        ? "assignments"
                                        : "hackathons"
                                }/${assignment.$id}/update`}
                            >
                                <FilePenIcon className="w-4 h-4" />
                                Update
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                            <Link
                                href={`/admin/${
                                    type === "assignment"
                                        ? "assignments"
                                        : "hackathons"
                                }/${assignment.$id}`}
                            >
                                <EyeIcon className="w-4 h-4" />
                                View
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
