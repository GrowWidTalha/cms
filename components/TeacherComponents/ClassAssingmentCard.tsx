/**
 * v0 by Vercel.
 * @see https://v0.dev/t/pSMTZWA7JLY
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminAssignment, ClassAssigments } from "@/types/types.appwrite";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import {
    CalendarIcon,
    ClipboardCheckIcon,
    EyeIcon,
    FilePenIcon,
} from "lucide-react";

export default function ClassAssignmentCard({
    assignment,
}: {
    assignment: ClassAssigments;
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
                            Created At:{" "}
                            {formatDateTime(assignment.$createdAt).dateTime}
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
                            <Link href={`/teacher/${assignment.$id}/update`}>
                                <FilePenIcon className="w-4 h-4" />
                                Update
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/teacher/${assignment.$id}`}>
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
