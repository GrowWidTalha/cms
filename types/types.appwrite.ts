import { Models } from "node-appwrite";

export interface ClassAssigments extends Models.Document {
    title: string;
    description: string;
    classSlot: ClassSlot;
    teacher: Teacher
    isPublished: boolean;
    resources: string;
}

export interface ClassSlot extends Models.Document {
    time: string;
    teacher: Teacher;
}

export interface ClassAssignmentSubmission extends Models.Document {
    student: Student;
    assignment: ClassAssigments;
    githubURL: string;
    linkedinURL: string;
    liveURL: string;
}

// CREATE STUDENT INTERFACE
export interface Student extends Models.Document {
    name: string;
    email: string;
    classTiming: string;
    rollNumber: string;
    password: string;
}
// Turn the above into an interface
export interface AdminAssignment extends Models.Document {
    title: string;
    description: string;
    type: "assignment" | "hackathon";
    startDate: string;
    endDate: string;
    milestones: string;
    resources:string;
    isEvaluated: boolean;
    isPublished: boolean;
}

// Made the above into an interface
export interface AdminAssignmentSubmission extends Models.Document {
    student: Student;
    assignment: AdminAssignment;
    answers: string;
}

export interface Teacher extends Models.Document {
    name: string;
    email: string;
    password: string;
    slots: { $id: string; time: string };
}
