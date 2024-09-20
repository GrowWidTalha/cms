import StudentNavbar from "@/components/layout/StudentNavbar";

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <StudentNavbar />
            {children}
        </div>
    );
}
