import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const AdminLogout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    function logout() {
        localStorage.removeItem("isAuthenticated");
        toast.success("Logged Out Successfully", {
            description: "You have been logged out of the admin panel.",
        });
        router.push("/admin"); // Redirect to home page or login page
    }
    return (
        <Button
            onClick={logout}
            className="flex w-full justify-start items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            variant={"ghost"}
        >
            {children}
        </Button>
    );
};

export default AdminLogout;
