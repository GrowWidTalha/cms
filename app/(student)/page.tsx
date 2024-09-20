import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressBar from "@/components/StudentComponents/ProgressBar";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <ProgressBar />

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Pending Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((item) => (
                                <Card key={item}>
                                    <CardContent className="h-32 flex items-center justify-center">
                                        Assignment {item}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Completed Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((item) => (
                                <Card key={item}>
                                    <CardContent className="h-32 flex items-center justify-center">
                                        Assignment {item}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
