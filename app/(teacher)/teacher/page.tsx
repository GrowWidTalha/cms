import { Users, FileText } from "lucide-react";
import ChartCard from "@/components/shared/ChartCard";
import { StatCard } from "@/components/shared/StatCard";
import { getTeacherChartData } from "@/actions/teacher.actions";
import { auth } from "@/auth";

export default async function Dashboard() {
    const session = await auth();
    if (!session) return <div>Please login to view this page</div>;
    const data = await getTeacherChartData(session.user.slots.$id);
    console.log(data);
    const { stats, chartData } = data;

    return (
        <div className="p-8 ml-10">
            <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Total Students"
                    value={stats.students}
                    icon={<Users className="h-4 w-4" />}
                    href="/teacher/students"
                />
                <StatCard
                    title="Assignments Submitted"
                    value={stats.assignmentsSubmissions}
                    icon={<FileText className="h-4 w-4" />}
                    href="/teacher/assignments"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Students Growth" data={chartData.students} />
                <ChartCard
                    title="Assignments Submitted"
                    data={chartData.assignmentSubmissions}
                />
            </div>
        </div>
    );
}
