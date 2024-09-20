import AdminNavbar from "@/components/admin/AdminNavbar";
import SideBar from "@/components/TeacherComponents/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <SideBar />
            <AdminNavbar />
            {children}
        </div>
    );
};

export default layout;
