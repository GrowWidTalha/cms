import AdminNavbar from "@/components/admin/AdminNavbar";
import SideBar from "@/components/TeacherComponents/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <SideBar />
            <AdminNavbar />
            <div className="flex flex-col w-full ml-10">{children}</div>
        </div>
    );
};

export default layout;
