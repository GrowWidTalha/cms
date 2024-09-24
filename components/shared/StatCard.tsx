import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
export function StatCard({
    title,
    value,
    icon,
    href,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    href: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <Button variant="link" className="p-0" asChild>
                    <a href={href}>View details</a>
                </Button>
            </CardContent>
        </Card>
    );
}
