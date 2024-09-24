// "use client";

import { Users, FileText, Award, Trophy } from "lucide-react";
import { getChartData } from "@/actions/admin.actions";
import ChartCard from "@/components/shared/ChartCard";
import { StatCard } from "@/components/shared/StatCard";

export default async function Dashboard() {
    const data = await getChartData();
    const { stats, chartData } = data;
    console.log(data);
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Total Students"
                    value={stats.students}
                    icon={<Users className="h-4 w-4" />}
                    href="/admin/students"
                />
                <StatCard
                    title="Assignments Submitted"
                    value={stats.assignments}
                    icon={<FileText className="h-4 w-4" />}
                    href="/admin/assignments"
                />
                <StatCard
                    title="Hackathons Submitted"
                    value={stats.hackathons}
                    icon={<Award className="h-4 w-4" />}
                    href="/admin/hackathons"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Students Growth" data={chartData.students} />
                <ChartCard
                    title="Assignments Submitted"
                    data={chartData.assignments}
                />
                <ChartCard
                    title="Hackathons Participation"
                    data={chartData.hackathons}
                />
            </div>
        </div>
    );
}
