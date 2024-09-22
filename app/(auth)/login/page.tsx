"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getSlots } from "@/actions/admin.actions";

interface Slot {
    $id: string;
    time: string;
}

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = loginSchema.extend({
    name: z.string().min(1, { message: "Name is required" }),
    rollNumber: z.string().min(1, { message: "Roll number is required" }),
    classTiming: z.string().min(1, { message: "Class timing is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function StudentAuthPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
    const [slots, setSlots] = useState<Slot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const signupForm = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            rollNumber: "",
            classTiming: "",
        },
    });

    useEffect(() => {
        const fetchSlots = async () => {
            setIsLoading(true);
            try {
                const response = await getSlots();
                setSlots(response);
            } catch (error) {
                console.error("Error fetching slots:", error);
                toast.error("Failed to load class timings. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSlots();
    }, []);

    const handleSubmit = async (
        values: LoginFormValues | SignupFormValues,
        type: "login" | "signup"
    ) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                name: "name" in values ? values.name : undefined,
                rollNumber:
                    "rollNumber" in values ? values.rollNumber : undefined,
                classTiming:
                    "classTiming" in values ? values.classTiming : undefined,
                role: "student",
                type: type,
                callbackUrl: "/",
                redirect: false,
            });
            if (result?.error) {
                switch (result.code) {
                    case "InvalidCredentials":
                        toast.error(
                            "Invalid email or password. Please try again."
                        );
                        break;
                    case "UnregisteredStudent":
                        toast.error(
                            "This roll number exists in Q2 of GIAIC. Please use a different roll number."
                        );
                        break;
                    case "EmailExists":
                        toast.error(
                            "An account with this email already exists. Please use a different email."
                        );
                        break;
                    default:
                        toast.error(
                            "An unexpected error occurred. Please try again."
                        );
                }
            } else {
                toast.success(
                    type === "login"
                        ? "Logged in successfully!"
                        : "Signed up successfully!"
                );
                router.push("/");
            }
        } catch (error) {
            console.error("An error occurred during sign in:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Student Authentication</CardTitle>
                    <CardDescription>
                        Login or sign up to access your account
                    </CardDescription>
                </CardHeader>
                <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(value as "login" | "signup")
                    }
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Form {...loginForm}>
                            <form
                                onSubmit={loginForm.handleSubmit((values) =>
                                    handleSubmit(values, "login")
                                )}
                            >
                                <CardContent className="space-y-2">
                                    <FormField
                                        control={loginForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={loginForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Logging in..."
                                            : "Login"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Form {...signupForm}>
                            <form
                                onSubmit={signupForm.handleSubmit((values) =>
                                    handleSubmit(values, "signup")
                                )}
                            >
                                <CardContent className="space-y-2">
                                    <FormField
                                        control={signupForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signupForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signupForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signupForm.control}
                                        name="rollNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Roll Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signupForm.control}
                                        name="classTiming"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Class Timing
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a class timing" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {isLoading ? (
                                                            <SelectItem
                                                                value="loading"
                                                                disabled
                                                            >
                                                                Loading...
                                                            </SelectItem>
                                                        ) : slots.length > 0 ? (
                                                            slots.map(
                                                                (slot) => (
                                                                    <SelectItem
                                                                        key={
                                                                            slot.$id
                                                                        }
                                                                        value={
                                                                            slot.$id
                                                                        }
                                                                    >
                                                                        {
                                                                            slot.time
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )
                                                        ) : (
                                                            <SelectItem
                                                                value="no-slots"
                                                                disabled
                                                            >
                                                                No slots
                                                                available
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Signing up..."
                                            : "Sign Up"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
