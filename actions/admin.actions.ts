"use server";

import { ADMIN_ASSIGN_COLL_ID, ADMIN_ASSIGN_SUB_COLL_ID, DATABASE_ID, databases, SLOT_COLL_ID, TEACHER_COLL_ID, USER_COLLECTION_ID } from "@/lib/appwrite";
import { resend } from "@/lib/resend";
import { parseStringify } from "@/lib/utils";
import { CreateAssignmentProps, CreateTeacherProps } from "@/types";
import { AdminAssignment, AdminAssignmentSubmission } from "@/types/types.appwrite";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { Student } from "@/types/types.appwrite";
import { SubmissionData } from "@/components/StudentComponents/columns";

export const createAssignment = async (assignment: CreateAssignmentProps) => {
    try {
        const document = await databases.createDocument(
            DATABASE_ID!,
            ADMIN_ASSIGN_COLL_ID!,
            ID.unique(),
            {
                title: assignment.title,
                description: assignment.description,
                startDate: assignment.startDate,
                endDate: assignment.endDate,
                type: assignment.type,
                milestones: assignment.milestones,
                resources: assignment.resources,
                isEvaluated: assignment.isEvaluated,
                isPublished: assignment.isPublished,
            }
        );
        return parseStringify(document);
    } catch (error) {
        console.log("Error Creating Assignment: ", error);
    }
};


export const getAllAssignments = async () => {
    try {
        const assignments = await databases.listDocuments(DATABASE_ID!, ADMIN_ASSIGN_COLL_ID!);
        return assignments.documents as AdminAssignment[];
    } catch (error) {
        console.log("Error Getting Assignments: ", error);
    }
};

export const getAssignmentById = async (assignmentId: string) => {
   try {
       const assignment = await databases.getDocument(DATABASE_ID!, ADMIN_ASSIGN_COLL_ID!, assignmentId);
       const responses = await databases.listDocuments(DATABASE_ID!, ADMIN_ASSIGN_SUB_COLL_ID!, [Query.equal("assignment", assignment.$id)]);
       return {assignment, responses}
   } catch (error) {
       console.log('Error Getting Assignment By Id: ', error)
   }
}

export const updateAssignment = async (assignmentId: string, assignment: CreateAssignmentProps) => {
    try {
        const document = await databases.updateDocument(DATABASE_ID!, ADMIN_ASSIGN_COLL_ID!, assignmentId, {
            title: assignment.title,
            description: assignment.description,
            startDate: assignment.startDate,
            endDate: assignment.endDate,
            type: assignment.type,
            milestones: assignment.milestones,
            resources: assignment.resources,
            isEvaluated: assignment.isEvaluated,
            isPublished: assignment.isPublished,
        });
        revalidatePath("/admin/assignments");
        revalidatePath(`/admin/assignments/${assignmentId}/update`);
        revalidatePath(`/admin/assignments/${assignmentId}`);
        return parseStringify(document);
    } catch (error) {
        console.log("Error Updating Assignment: ", error);
    }
};


export const getAllStudents = async (slot?: string) => {
   try {
       const students = await databases.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!,
        slot ? [Query.equal("slot", slot)] : [] // Use an empty array if slot is undefined
       )
       return {
        total: students.total,
        students: students.documents
       }
   } catch (error) {
       console.log('', error)
   }
}

export const getStudentById = async (studentId: string) => {
    try {
        const student: Student = await databases.getDocument(DATABASE_ID!, USER_COLLECTION_ID!, studentId);
        const responses = await databases.listDocuments(DATABASE_ID!, ADMIN_ASSIGN_SUB_COLL_ID!, [Query.equal("student", student.$id)]);
        return {student , responses: responses.documents as SubmissionData[]};
    } catch (error) {
        console.log('Error Getting Student By Id: ', error)
    }
}


export const createTeacher = async (teacher: CreateTeacherProps) => {
    try {
        const document = await databases.createDocument(DATABASE_ID!, TEACHER_COLL_ID!, ID.unique(), {
            name: teacher.name,
            email: teacher.email,
            password: teacher.password,
            slots: teacher.slot,
        })
        await resend.emails.send({
            from: 'giaicCMS@talhaali.xyz',
            to: teacher.email,
            subject: 'Welcome to the GIAIC CMS',
            html: `<p>You have been successfully registered as a teacher in the GIAIC CMS.
            Your username is ${teacher.email} and your password is ${teacher.password}.
            Please change your password after logging in.
            </p>`
        })
        return parseStringify(document);
    } catch (error) {
        console.log('Error Creating Teacher: ', error)
    }
}

export const createSlot = async (slot: string) => {
    try {
        const document = await databases.createDocument(
            DATABASE_ID!, SLOT_COLL_ID!, ID.unique(), {
                time: slot,
            },
        )
        revalidatePath('/admin/teachers');
        revalidatePath('/admin/teachers/create');
        return parseStringify(document);
    } catch (error) {
        console.log('Error Creating Slot Enum: ', error)
    }
}

export const getAllTeachers = async () => {
    try {
        const teachers = await databases.listDocuments(DATABASE_ID!, TEACHER_COLL_ID!);
        return parseStringify(teachers.documents)
    } catch (error) {
        console.log('Error Getting All Teachers: ', error)
    }
}

export const getSlots = async () => {
    try {
        const slots = await databases.listDocuments(DATABASE_ID!, SLOT_COLL_ID!);
        return parseStringify(slots.documents);
    } catch (error) {
        console.log('Error Getting Slots: ', error)
    }
}

export const updateTeacher = async (teacherId: string, teacher: CreateTeacherProps) => {
    try {
        const document = await databases.updateDocument(DATABASE_ID!, TEACHER_COLL_ID!, teacherId, {
            name: teacher.name,
            email: teacher.email,
            password: teacher.password,
            slots: teacher.slot,
        })
        revalidatePath('/admin/teachers');
        revalidatePath(`/admin/teachers/${teacherId}/update`);
        revalidatePath('/teacher/profile')
        return parseStringify(document);
    } catch (error) {
        console.log('Error Updating Teacher: ', error)
    }
}
