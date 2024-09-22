"use client";

import React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpDown, Github, Globe } from "lucide-react";
import { Models } from "appwrite";
import { AdminAssignmentSubmission } from "@/types/types.appwrite";
import { formatDateTime } from "@/lib/utils";

export interface AdminAssignment extends Models.Document {
    title: string;
    description: string;
    type: "assignment" | "hackathon";
    startDate: string;
    endDate: string;
    milestones: string;
    resources: string;
    isEvaluated: boolean;
    isPublished: boolean;
}

const createMilestoneColumns = (
    milestones: string
): ColumnDef<AdminAssignmentSubmission>[] => {
    return JSON.parse(milestones).map(
        (milestone: { name: string; description: string }, index: number) => ({
            accessorKey: milestone.name,
            header: milestone.name,
            cell: ({ row }: { row: any }) => {
                const responses = JSON.parse(row.original.responses || "[]");
                const response = responses[index] || {};
                const githubLink = response.githubURL || "#";
                const deployedLink = response.liveURL || "#";
                return (
                    <div className="flex space-x-2">
                        <Link
                            href={githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                        >
                            <Github size={20} />
                        </Link>
                        <Link
                            href={deployedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                        >
                            <Globe size={20} />
                        </Link>
                    </div>
                );
            },
        })
    );
};

const baseColumns: ColumnDef<AdminAssignmentSubmission>[] = [
    {
        accessorKey: "name",
        header: "Student",
        cell: ({ row }) => {
            const student = row.original.student;
            return <span>{student.name}</span>;
        },
    },
    {
        accessorKey: "submitted",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Submitted
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const submitted = row.original.$createdAt;
            return <span>{formatDateTime(submitted).dateTime}</span>;
        },
    },
];

interface StudentDataTableProps {
    data: AdminAssignmentSubmission[];
    assignment: AdminAssignment;
}
// const actionsColumn: ColumnDef<AdminAssignmentSubmission> = {
//     id: "actions",
//     header: "Actions",
//     cell: () => {
//         return (
//             <Link
//                 href="#"
//                 className="text-primary hover:text-primary/80"
//                 prefetch={false}
//             >
//                 View
//             </Link>
//         );
//     },
// };
export default function StudentDataTable({
    data,
    assignment,
}: StudentDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");

    const columns = React.useMemo(() => {
        const milestoneColumns = createMilestoneColumns(assignment.milestones);
        return [...baseColumns, ...milestoneColumns];
    }, [assignment.milestones]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
    });

    return (
        <div className="space-y-4">
            <Input
                placeholder="Filter students..."
                value={globalFilter ?? ""}
                onChange={(event) =>
                    setGlobalFilter(String(event.target.value))
                }
                className="max-w-sm"
            />
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
