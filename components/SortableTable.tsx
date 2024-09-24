"use client";
import { useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";

interface Column {
    key: string;
    label: string;
    // @ts-ignore
    render?: (value: any) => JSX.Element;
}

interface SortableTableProps {
    data: Record<string, any>[]; // Updated type for data
    columns: Column[];
    initialSortColumn: string;
}

const SortableTable: React.FC<SortableTableProps> = ({
    data,
    columns,
    initialSortColumn,
}) => {
    const [sortColumn, setSortColumn] = useState(initialSortColumn);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const handleSort = (column: string) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
            return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
            return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead
                            key={column.key}
                            onClick={() => handleSort(column.key)}
                            className="cursor-pointer"
                        >
                            {column.label}
                            {sortColumn === column.key &&
                                (sortDirection === "asc" ? (
                                    <ChevronUpIcon className="inline ml-1" />
                                ) : (
                                    <ChevronDownIcon className="inline ml-1" />
                                ))}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedData.map((row, index) => (
                    <TableRow key={index}>
                        {columns.map((column) => (
                            <TableCell key={column.key}>
                                {column.render
                                    ? column.render(row[column.key])
                                    : row[column.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default SortableTable;
