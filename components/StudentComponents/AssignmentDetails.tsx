"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInDays, parseISO, isFuture, isPast } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import {
    AdminAssignment,
    AdminAssignmentSubmission,
    ClassAssigments,
    ClassAssignmentSubmission,
} from "@/types/types.appwrite";
import { Calendar, Clock, Link as LinkIcon } from "lucide-react";
import { z } from "zod";
import { Session } from "@auth/core/types";
import {
    submitClassAssignmentResponse,
    submitHackathonOrAssignmentResponse,
} from "@/actions/student.actions";
import SubmitButton from "../shared/SubmitButton";

type AssignmentType = AdminAssignment | ClassAssigments;

const hackathonAssignmentSchema = z.object({
    milestones: z.array(
        z.object({
            githubURL: z
                .string()
                .url({ message: "Please enter a valid GitHub URL" }),
            liveURL: z
                .string()
                .url({ message: "Please enter a valid live URL" }),
        })
    ),
});

const classAssignmentSchema = z.object({
    githubURL: z.string().url({ message: "Please enter a valid GitHub URL" }),
    linkedinURL: z
        .string()
        .url({ message: "Please enter a valid LinkedIn URL" })
        .optional(),
    liveURL: z.string().url({ message: "Please enter a valid URL" }),
});

interface AssignmentDetailsProps {
    assignment: AssignmentType;
    type: "assignment" | "hackathon" | "classAssignment";
    session: Session;
    responses: AdminAssignmentSubmission | ClassAssignmentSubmission | null;
}

const AssignmentDetails: React.FC<AssignmentDetailsProps> = ({
    assignment,
    type,
    session,
    responses,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const isHackathon = type === "hackathon";
    const isClassAssignment = type === "classAssignment";
    // const isAdminAssignment = type === "assignment";

    const startDate = isClassAssignment ? null : parseISO(assignment.startDate);
    const endDate = isClassAssignment ? null : parseISO(assignment.endDate);
    const isStartInFuture = isClassAssignment ? false : isFuture(startDate!);
    const isEndInPast = isClassAssignment ? false : isPast(endDate!);
    const showLimitedInfo = isHackathon && (isStartInFuture || isEndInPast);
    const formSchema = isClassAssignment
        ? classAssignmentSchema
        : hackathonAssignmentSchema;

    console.log(responses);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: isClassAssignment
            ? {
                  githubURL: "",
                  linkedinURL: "",
                  liveURL: "",
              }
            : {
                  milestones: assignment.milestones
                      ? JSON.parse(assignment.milestones).map(() => ({
                            githubURL: "",
                            liveURL: "",
                        }))
                      : [],
              },
    });

    const daysLeft = isClassAssignment
        ? null
        : differenceInDays(endDate!, new Date());

    const onSubmitHackathonOrAssignment = async (
        values: z.infer<typeof hackathonAssignmentSchema>
    ) => {
        setIsLoading(true);
        try {
            const responseData = {
                student: session.user.id,
                assignment: assignment.$id,
                responses: JSON.stringify(values.milestones),
            };
            const response = await submitHackathonOrAssignmentResponse(
                responseData
            );
            if (response) {
                toast.success("Submission successful!");
            }
        } catch (error) {
            console.error("Error submitting:", error);
            toast.error("Failed to submit. Please try again.");
        }
        setIsLoading(false);
    };

    const onSubmitClassAssignment = async (
        values: z.infer<typeof classAssignmentSchema>
    ) => {
        setIsLoading(true);
        try {
            const responseData = {
                student: session.user.id,
                assignment: assignment.$id,
                githubURL: values.githubURL,
                linkedinURL: values.linkedinURL,
                liveURL: values.liveURL,
            };
            const response = await submitClassAssignmentResponse(responseData);
            if (response) {
                toast.success("Submission successful!");
            }
        } catch (error) {
            console.error("Error submitting:", error);
            toast.error("Failed to submit. Please try again.");
        }
        setIsLoading(false);
    };

    const renderSubmissionForm = () => (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(
                    // @ts-ignore
                    isClassAssignment
                        ? onSubmitClassAssignment
                        : onSubmitHackathonOrAssignment
                )}
                className="space-y-8"
            >
                {isClassAssignment ? (
                    <>
                        <FormField
                            control={form.control}
                            name="githubURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GitHub URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://github.com/yourusername/project"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The URL of your GitHub repository for
                                        this project.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="liveURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Live Project URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://your-project.vercel.app"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The URL where your project is deployed
                                        and accessible.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="linkedinURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        LinkedIn URL (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://www.linkedin.com/in/yourusername"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your LinkedIn profile URL (optional).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                ) : (
                    assignment.milestones &&
                    JSON.parse(assignment.milestones).map(
                        (milestone: { name: string }, index: number) => (
                            <div key={index} className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    {milestone.name}
                                </h3>
                                <FormField
                                    control={form.control}
                                    name={`milestones.${index}.githubURL`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GitHub URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://github.com/yourusername/project"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                The GitHub repository URL for
                                                this milestone.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`milestones.${index}.liveURL`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Live URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://your-milestone.vercel.app"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                The live URL for this
                                                milestone&apos;s deployment.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )
                    )
                )}
                <SubmitButton isLoading={isLoading}>
                    Submit Assignment
                </SubmitButton>
            </form>
        </Form>
    );

    const renderSubmittedResponse = () => {
        if (!responses) return null;

        if (isClassAssignment) {
            const classResponse = responses as ClassAssignmentSubmission;
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Your Submitted Response
                    </h3>
                    <p>
                        <strong>GitHub URL:</strong>{" "}
                        <Link
                            href={classResponse.githubURL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {classResponse.githubURL}
                        </Link>
                    </p>
                    <p>
                        <strong>Live URL:</strong>{" "}
                        <Link
                            href={classResponse.liveURL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {classResponse.liveURL}
                        </Link>
                    </p>
                    {classResponse.linkedinURL && (
                        <p>
                            <strong>LinkedIn URL:</strong>{" "}
                            <Link
                                href={classResponse.linkedinURL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {classResponse.linkedinURL}
                            </Link>
                        </p>
                    )}
                </div>
            );
        } else {
            const adminResponse = responses as AdminAssignmentSubmission;
            const parsedResponses = JSON.parse(adminResponse.responses);
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        Your Submitted Response
                    </h3>
                    {parsedResponses.map(
                        (
                            milestone: { githubURL: string; liveURL: string },
                            index: number
                        ) => (
                            <div key={index} className="space-y-2">
                                <h4 className="font-medium">
                                    Milestone {index + 1}
                                </h4>
                                <p>
                                    <strong>GitHub URL:</strong>{" "}
                                    <Link
                                        href={milestone.githubURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {milestone.githubURL}
                                    </Link>
                                </p>
                                <p>
                                    <strong>Live URL:</strong>{" "}
                                    <Link
                                        href={milestone.liveURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {milestone.liveURL}
                                    </Link>
                                </p>
                            </div>
                        )
                    )}
                </div>
            );
        }
    };

    if (showLimitedInfo) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Card className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold mb-4">
                            {assignment.title}
                        </CardTitle>
                        <CardDescription className="text-2xl font-semibold text-white">
                            {isStartInFuture ? (
                                <>
                                    Starts in {daysLeft} days
                                    <Clock className="inline-block text-white ml-2 w-6 h-6" />
                                </>
                            ) : (
                                <>
                                    Ended {Math.abs(daysLeft!)} days ago
                                    <Calendar className="inline-block ml-2 w-6 h-6 text-white" />
                                </>
                            )}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">
                            {assignment.title}
                        </CardTitle>
                        {!isClassAssignment && (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {startDate &&
                                        startDate.toLocaleDateString()}{" "}
                                    - {endDate && endDate.toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                    {!isClassAssignment && (
                        <CardDescription className="flex items-center space-x-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{daysLeft} days left</span>
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList>
                            <TabsTrigger value="description">
                                Description
                            </TabsTrigger>
                            <TabsTrigger value="resources">
                                Resources
                            </TabsTrigger>
                            {!isClassAssignment && (
                                <TabsTrigger value="milestones">
                                    Milestones
                                </TabsTrigger>
                            )}
                        </TabsList>
                        <TabsContent value="description">
                            <div className="prose max-w-none">
                                <ReactMarkdown>
                                    {assignment.description}
                                </ReactMarkdown>
                            </div>
                        </TabsContent>
                        <TabsContent value="resources">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {assignment.resources &&
                                    JSON.parse(assignment.resources).map(
                                        (resource: {
                                            url: string;
                                            name: string;
                                        }) => (
                                            <Link
                                                href={resource.url}
                                                key={resource.name}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start"
                                                >
                                                    <LinkIcon className="w-4 h-4 mr-2" />
                                                    {resource.name}
                                                </Button>
                                            </Link>
                                        )
                                    )}
                            </div>
                        </TabsContent>
                        {!isClassAssignment && (
                            <TabsContent value="milestones">
                                <div className="space-y-4">
                                    {assignment.milestones &&
                                        JSON.parse(assignment.milestones).map(
                                            (
                                                milestone: {
                                                    name: string;
                                                    description: string;
                                                },
                                                index: number
                                            ) => (
                                                <Card key={index}>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">
                                                            {milestone.name}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p>
                                                            {
                                                                milestone.description
                                                            }
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            )
                                        )}
                                </div>
                            </TabsContent>
                        )}
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {responses ? "Your Submission" : "Submit Your Work"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {responses
                        ? renderSubmittedResponse()
                        : renderSubmissionForm()}
                </CardContent>
            </Card>
        </div>
    );
};

export default AssignmentDetails;
