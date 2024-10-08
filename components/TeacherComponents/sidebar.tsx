"use client";
import React, { useState } from "react";
import {
    MountainIcon,
    HomeIcon,
    FileIcon,
    UsersIcon,
    PencilIcon,
    LogOutIcon,
    SquareChevronLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
const SideBar = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-white transition-all duration-300 ${
                isSidebarExpanded ? "w-64" : "w-14"
            }`}
        >
            <div className="flex h-14 items-center justify-center border-b">
                <Link
                    href="#"
                    className="flex items-center gap-2"
                    prefetch={false}
                >
                    <MountainIcon className={`h-6 w-6`} />
                    <span
                        className={`transition-opacity duration-300 ${
                            !isSidebarExpanded ? "hidden" : "block"
                        }`}
                    >
                        Teacher Dashboard
                    </span>
                </Link>
            </div>
            <nav className="flex flex-1 flex-col items-start gap-2 overflow-auto px-2 py-4">
                <Link
                    href="/teacher"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <HomeIcon className={`h-5 w-5 `} />
                    <span
                        className={`transition-opacity duration-300 ${
                            !isSidebarExpanded ? "hidden" : "block"
                        }`}
                    >
                        Home
                    </span>
                </Link>
                <Link
                    href="/teacher/assignments"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    prefetch={false}
                >
                    <FileIcon className={`h-5 w-5`} />
                    <span
                        className={`transition-opacity duration-300 ${
                            !isSidebarExpanded ? "hidden" : "block"
                        }`}
                    >
                        Assignments
                    </span>
                </Link>
                <Link
                    href="/teacher/students"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    prefetch={false}
                >
                    <UsersIcon className={`h-5 w-5 `} />
                    <span
                        className={`transition-opacity duration-300 ${
                            !isSidebarExpanded ? "hidden" : "block"
                        }`}
                    >
                        Students
                    </span>
                </Link>
                <Link
                    href="/teacher/profile"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    prefetch={false}
                >
                    <PencilIcon className={`h-5 w-5 `} />
                    <span
                        className={`transition-opacity duration-300 ${
                            !isSidebarExpanded ? "hidden" : "block"
                        }`}
                    >
                        Profile
                    </span>
                </Link>
                <Button
                    className="flex w-full justify-start items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    variant={"ghost"}
                    onClick={async () => await signOut()}
                >
                    <LogOutIcon className={`h-5 w-5 `} />
                    <span
                        className={`transition-opacity duration-300 ${
                            !isSidebarExpanded ? "hidden" : "block"
                        }`}
                    >
                        Logout
                    </span>
                </Button>
            </nav>
            <div className="mt-auto flex items-center justify-center p-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                >
                    <SquareChevronLeftIcon className="h-5 w-5" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </div>
        </aside>
    );
};

export default SideBar;
