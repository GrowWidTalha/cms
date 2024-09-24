import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignOutBtn from "../AuthComponents/SignOutBtn";

export default function StudentNavbar() {
    return (
        <header className="border-b">
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between h-16">
                    <Link href={"/"}>
                        <div className="text-2xl font-bold">CMS</div>
                    </Link>
                    <ul className="hidden md:flex space-x-4">
                        <li>
                            <Button variant="ghost" asChild>
                                <Link href="/profile" prefetch={false}>
                                    My Profile
                                </Link>
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost" asChild>
                                <Link href="/leaderboard" prefetch={false}>
                                    Leader Board
                                </Link>
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost" asChild>
                                <Link href="/assignments" prefetch={false}>
                                    Assignments
                                </Link>
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost" asChild>
                                <Link href="/resources" prefetch={false}>
                                    Resources
                                </Link>
                            </Button>
                        </li>
                        <li>
                            <SignOutBtn />
                        </li>
                    </ul>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="md:hidden"
                            >
                                <MenuIcon className="h-6 w-6" />
                                <span className="sr-only">
                                    Toggle navigation menu
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-white">
                            <div className="grid gap-4 py-4">
                                <Button variant="ghost" asChild>
                                    <Link href="/profile" prefetch={false}>
                                        My Profile
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href="/leaderboard" prefetch={false}>
                                        Leader Board
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href="/assignments" prefetch={false}>
                                        Assignments
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href="/resources" prefetch={false}>
                                        Resources
                                    </Link>
                                </Button>
                                <SignOutBtn />
                            </div>
                        </SheetContent>
                    </Sheet>
                </nav>
            </div>
        </header>
    );
}
