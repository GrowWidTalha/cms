"use server"
import { CLASS_ASSIGN_COLL_ID, DATABASE_ID, databases, TEACHER_COLL_ID } from "@/lib/appwrite"
import { CreateClassAssignmentProps, UpdateClassAssignmentProps } from "@/types"
import { ClassAssigments } from "@/types/types.appwrite";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite"

export const createClassAssignment = async (assignment: CreateClassAssignmentProps) => {
   try {
       const document = await databases.createDocument(DATABASE_ID!, CLASS_ASSIGN_COLL_ID!, ID.unique(), {
        title: assignment.title,
        description: assignment.description,
        resources: assignment.resources,
        teacher: assignment.teacher,
        classSlot: assignment.classSlot,
        isPublished: assignment.isPublished,
       })
       return document
    } catch (error) {
        console.log("Error creating class assignment", error);
    }
};

export const updateClassAssignment = async (assignmentId: string, assignment: UpdateClassAssignmentProps) => {
    try {
        const document = await databases.updateDocument(DATABASE_ID!, CLASS_ASSIGN_COLL_ID!, assignmentId, {
            title: assignment.title,
            description: assignment.description,
            resources: assignment.resources,
            teacher: assignment.teacher,
            classSlot: assignment.classSlot,
            isPublished: assignment.isPublished,
        })
        return document
    } catch (error) {
        console.log("Error updating class assignment", error);
    }
};

export const getTeacherByEmail = async (email: string) => {
    try {
        const teacher = await databases.listDocuments(DATABASE_ID!, TEACHER_COLL_ID!, [Query.equal("email", email)]);
        return teacher.documents[0]
    } catch (error) {
        console.log("Error getting teacher by email", error);
    }
}

export const getClassAssignmentById = async (assignmentId: string) => {
    try {
        const assignment = await databases.getDocument(DATABASE_ID!, CLASS_ASSIGN_COLL_ID!, assignmentId);
        revalidatePath("/teacher/assignments");
        revalidatePath(`/teacher/assignments/${assignmentId}/update`);
        return assignment
    } catch (error) {
        console.log("Error getting class assignment by id", error);
    }
}


export const getAllClassAssignments = async (slot: string) => {
   try {
       const assignments = await databases.listDocuments(DATABASE_ID!, CLASS_ASSIGN_COLL_ID!, [Query.equal("slots", slot)])
       return assignments.documents as ClassAssigments[]
   } catch (error) {
       console.log('', error)
   }
}
