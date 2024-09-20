"use client";

import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Define types based on the provided data structure
type Student = {
    email: string;
    rollNumber: string;
    classTiming: string;
    name: string;
    $id: string;
};

type Assignment = {
    title: string;
    description: string;
    type: "hackathon" | "assignment";
    startDate: string;
    endDate: string;
    milestones: string[];
    resources: string[];
    isEvaluated: boolean;
    isPublished: boolean;
    $id: string;
};

type SubmissionData = {
    answers: string[];
    $id: string;
    $createdAt: string;
    student: Student;
    assignment: Assignment;
};

const assignmentColumns = [
    {
        key: "title",
        label: "Assignment",
        render: (submission: SubmissionData) => (
            <Link href={`/admin/assignments/${submission.assignment.$id}`}>
                {submission.assignment.title}
            </Link>
        ),
    },
    {
        key: "submittedDate",
        label: "Submitted Date",
        render: (submission: SubmissionData) => (
            <span>{formatDateTime(submission.$createdAt).dateTime}</span>
        ),
    },
    {
        key: "type",
        label: "Type",
        render: (submission: SubmissionData) => (
            <Badge
                variant={
                    submission.assignment.type === "hackathon"
                        ? "secondary"
                        : "outline"
                }
            >
                {submission.assignment.type}
            </Badge>
        ),
    },
    {
        key: "grade",
        label: "Grade",
        render: () => <span>Not graded</span>, // Assuming grade is not provided in the current data structure
    },
];

export default function StudentAssignmentTable({
    submissions,
}: {
    submissions: SubmissionData[];
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {assignmentColumns.map((column) => (
                        <TableHead key={column.key}>{column.label}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {submissions.map((submission) => (
                    <TableRow key={submission.$id}>
                        {assignmentColumns.map((column) => (
                            <TableCell key={`${submission.$id}-${column.key}`}>
                                {column.render
                                    ? column.render(submission)
                                    : (submission as any)[column.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
