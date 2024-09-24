"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import SubmitButton from "@/components/shared/SubmitButton";
import { toast } from "sonner";
// TODO: Add a custom error component for the teacher login page

export default function TeacherLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            role: "teacher",
            callbackUrl: "/teacher",
        });

        if (result?.error) {
            switch (result.code) {
                case "InvalidTeacherCredentials":
                    toast.error("Invalid teacher credentials");
                    break;
                default:
                    break;
            }
        } else {
            router.push("/teacher");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Teacher Login</CardTitle>
                    <CardDescription>
                        Enter your details to sign in
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton isLoading={loading}>Login</SubmitButton>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
