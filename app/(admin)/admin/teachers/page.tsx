import CreateTeacherDialog from "@/components/admin/CreateTeacherDialog";
import TeacherTable from "@/components/admin/Table/TeacherTable";
import { getAllTeachers } from "@/actions/admin.actions";
import Loader from "@/app/loading";

export default async function Component() {
    const teachers = await getAllTeachers();
    if (!teachers) {
        return <Loader />;
    }
    return (
        <div className="w-full p-10">
            <div className="flex items-center justify-between border-b border-muted/40 bg-muted/40 px-6 py-4">
                <h1 className="text-2xl font-bold">Teachers</h1>
                <CreateTeacherDialog />
            </div>
            <div className="overflow-x-auto">
                <TeacherTable data={teachers} />
            </div>
        </div>
    );
}
