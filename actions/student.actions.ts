"use server"

import {
    ADMIN_ASSIGN_COLL_ID,
    ADMIN_ASSIGN_SUB_COLL_ID,
    CLASS_ASSIGN_COLL_ID,
    CLASS_ASSIGN_SUB_COLL_ID,
    DATABASE_ID,
    databases,
} from "@/lib/appwrite";
import { parseStringify } from "@/lib/utils";
import { SubmitClassAssignmentProps, SubmitHackathonOrAssignmentProps } from "@/types";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

export const getThisWeekAssignment = async (slot: string) => {
    try {
        const assignments = await databases.listDocuments(
            DATABASE_ID!,
            CLASS_ASSIGN_COLL_ID!,
            [Query.equal("slot", slot)]
        );
        const today = new Date();
        const thisWeekStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - today.getDay() + 1
        );
        const thisWeekEnd = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - today.getDay() + 7
        );
        const thisWeekAssignment = assignments.documents.filter(
            (assignment) => {
                const assignmentDate = new Date(assignment.$createdAt);
                return (
                    assignmentDate >= thisWeekStart &&
                    assignmentDate <= thisWeekEnd
                );
            }
        );
        console.log(thisWeekAssignment);
        return thisWeekAssignment;
    } catch (error) {
        console.log("Error Getting This Week Assignment: ", error);
    }
};

export const getLatestAdminAssignment = async () => {
    try {
        const assignments = await databases.listDocuments(
            DATABASE_ID!,
            ADMIN_ASSIGN_COLL_ID!,
            [Query.equal("isPublished", true), Query.orderAsc("$createdAt")]
        );
        return assignments.documents[0];
    } catch (error) {
        console.log("Error Getting Latest Admin Assignment: ", error);
    }
};

export const getAssignmentAndResponsesById = async (
    assignmentId: string,
    type: "assignment" | "hackathon" | "classAssignment",
    userId: string,
) => {
    try {
        const assignment = await databases.getDocument(
            DATABASE_ID!,
            type === "classAssignment"
                ? CLASS_ASSIGN_COLL_ID!
                : ADMIN_ASSIGN_COLL_ID!,
            assignmentId
        );
        const response = await databases.listDocuments(
            DATABASE_ID!,
            type === "classAssignment"
                ? CLASS_ASSIGN_SUB_COLL_ID!
                : ADMIN_ASSIGN_SUB_COLL_ID!,
            [
                Query.equal(
                    `${
                        type === "classAssignment" ? "Assignments" : "assignment"
                    }`,
                    assignmentId
                ), Query.equal(`${type === "classAssignment" ? "Student" : "student"}`, userId),
            ]
        );
        return parseStringify({ assignment, response: response.documents[0] });
    } catch (error) {
        console.log("Error Getting Assignment By Id: ", error);
    }
};


export const submitClassAssignmentResponse = async (responseData: SubmitClassAssignmentProps) => {
   try {
       const document = await databases.createDocument(
        DATABASE_ID!,
        CLASS_ASSIGN_SUB_COLL_ID!,
        ID.unique(),
        {
            Student: responseData.student,
            Assignments: responseData.assignment,
            githubURL: responseData.githubURL,
            linkedinURL: responseData.linkedinURL,
            liveURL: responseData.liveURL,
        }
       )
       revalidatePath(`/assignment/${responseData.assignment}`)
       return parseStringify(document)
   } catch (error) {
       console.log('Error Submittin Class Assignment Response: ', error)
   }
}
export const submitHackathonOrAssignmentResponse = async (responseData: SubmitHackathonOrAssignmentProps) => {
   try {
       const response = await databases.createDocument(
        DATABASE_ID!,
        ADMIN_ASSIGN_SUB_COLL_ID!,
        ID.unique(),
        {
            student: responseData.student,
            assignment: responseData.assignment,
            responses: responseData.responses,
        }
       )
       revalidatePath(`/assignment/${responseData.assignment}`)
       return parseStringify(response)
   } catch (error) {
       console.log('Error Submitting Hackathon/Assignment Response: ', error)
   }
}

export const getClassAssignmentResponses = async (studentId: string) => {
   try {
       const document = await databases.listDocuments(
        DATABASE_ID!,
        CLASS_ASSIGN_SUB_COLL_ID!,
        [Query.equal("Student", studentId)]
       )
       return parseStringify(document.documents)
   } catch (error) {
       console.log('Error Getting Class Assignment Responses: ', error)
   }
}
