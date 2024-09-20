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

const SortableTable = ({
    data,
    columns,
    initialSortColumn,
}: {
    data: any;
    columns: any;
    initialSortColumn: any;
}) => {
    const [sortColumn, setSortColumn] = useState(initialSortColumn);
    const [sortDirection, setSortDirection] = useState("asc");
    console.log(data);
    const handleSort = (column) => {
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
