"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDataPoint {
    date: string;
    count: number;
}

interface ChartCardProps {
    title: string;
    data: ChartDataPoint[];
}

function EmptyState({ title }: { title: string }) {
    return (
        <Card className="w-full h-[400px] flex flex-col items-center justify-center">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600">
                    No data available
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    There is no data to display for this chart at the moment.
                </p>
            </CardContent>
        </Card>
    );
}

export default function ChartCard({ title, data }: ChartCardProps) {
    if (!data || data.length === 0) {
        return <EmptyState title={title} />;
    }

    const chartConfig: ChartConfig = {
        count: {
            label: "Count",
            color: "hsl(var(--primary))",
        },
    };

    const [currentDate, setCurrentDate] = useState(() => {
        const latestDate = new Date(
            Math.max(...data.map((d) => new Date(d.date).getTime()))
        );
        return new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
    });

    const currentMonthData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const allDays = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateString = `${year}-${String(month + 1).padStart(
                2,
                "0"
            )}-${String(day).padStart(2, "0")}`;
            return { date: dateString, count: 0 };
        });

        const dataMap = new Map(data.map((item) => [item.date, item.count]));

        return allDays.map((day) => ({
            ...day,
            count: dataMap.get(day.date) || 0,
        }));
    }, [data, currentDate]);

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            if (direction === "prev") {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    const maxDate = new Date(
        Math.max(...data.map((d) => new Date(d.date).getTime()))
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateMonth("prev")}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous month</span>
                    </Button>
                    <span className="font-medium">
                        {currentDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateMonth("next")}
                        disabled={
                            currentDate.getFullYear() ===
                                maxDate.getFullYear() &&
                            currentDate.getMonth() === maxDate.getMonth()
                        }
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next month</span>
                    </Button>
                </div>
                <ChartContainer config={chartConfig}>
                    <BarChart data={currentMonthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                `${new Date(value).getDate()}`
                            }
                            interval={0}
                        />
                        <YAxis
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
