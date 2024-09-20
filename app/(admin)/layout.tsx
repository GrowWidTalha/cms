import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminPasskeyDialog from "@/components/admin/AdminPasskeyDialog";
import AdminSideBar from "@/components/admin/AdminSideBar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen w-full">
            <AdminSideBar />
            <div className="flex flex-1 flex-col">
                <AdminNavbar />
                <div className="flex-1 ml-6 p-4 sm:ml-6">
                    {children}

                    <AdminPasskeyDialog />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
