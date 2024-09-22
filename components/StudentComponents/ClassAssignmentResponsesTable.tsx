"use client";

import React from "react";
import { ClassAssignmentSubmission } from "@/types/types.appwrite";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

export const columns: ColumnDef<ClassAssignmentSubmission>[] = [
    {
        id: "name",
        header: "Student",
        accessorFn: (row) => row.Student.name,
        cell: ({ row }) => {
            const student = row.original.Student;
            return <span>{student.name}</span>;
        },
    },
    {
        id: "name",
        header: "Assignment",
        accessorFn: (row) => row.Student.name,
        cell: ({ row }) => {
            const assignment = row.original.Assignments;
            return (
                <Link
                    className="underline"
                    href={`/assignment/${assignment.$id}`}
                >
                    {assignment.title}
                </Link>
            );
        },
    },
    {
        id: "githubURL",
        header: "GitHub URL",
        accessorKey: "githubURL",
        cell: ({ row }) => (
            <Link
                href={row.original.githubURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                {row.original.githubURL}
            </Link>
        ),
    },
    {
        id: "liveURL",
        header: "Live URL",
        accessorKey: "liveURL",
        cell: ({ row }) => (
            <Link
                href={row.original.liveURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                {row.original.liveURL}
            </Link>
        ),
    },
    {
        id: "linkedinURL",
        header: "LinkedIn URL",
        accessorKey: "linkedinURL",
        cell: ({ row }) =>
            row.original.linkedinURL ? (
                <Link
                    href={row.original.linkedinURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    {row.original.linkedinURL}
                </Link>
            ) : (
                <span className="text-gray-400">Not provided</span>
            ),
    },
];
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}
export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
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
    );
}
