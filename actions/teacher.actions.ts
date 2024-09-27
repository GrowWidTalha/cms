"use server"
import { CLASS_ASSIGN_COLL_ID, CLASS_ASSIGN_SUB_COLL_ID, DATABASE_ID, databases, TEACHER_COLL_ID, USER_COLLECTION_ID } from "@/lib/appwrite"
import { parseStringify } from "@/lib/utils";
import { CreateClassAssignmentProps, UpdateClassAssignmentProps } from "@/types"
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite"
import { processChartData } from "./admin.actions";

export const createClassAssignment = async (assignment: CreateClassAssignmentProps) => {
   try {
       const document = await databases.createDocument(DATABASE_ID!, CLASS_ASSIGN_COLL_ID!, ID.unique(), {
        title: assignment.title,
        description: assignment.description,
        resources: assignment.resources,
        teacher: assignment.teacher,
        slot: assignment.classSlot,
        isPublished: assignment.isPublished,
       })
       revalidatePath("/")
       revalidatePath("/profile")
       revalidatePath("/teacher/")
       revalidatePath("/teacher/assignments")
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
       const assignments = await databases.listDocuments(DATABASE_ID!, CLASS_ASSIGN_COLL_ID!, [Query.equal("slot", slot)])
       return parseStringify(assignments.documents)
   } catch (error) {
       console.log('Error getting all class assignments: ', error)
   }
}


export const getClassAssignmentResponses = async (assignmentId: string) => {
   try {
       const document = await databases.listDocuments(
        DATABASE_ID!,
        CLASS_ASSIGN_SUB_COLL_ID!,
        [Query.equal("Assignments", assignmentId)]
       )
       return document.documents
   } catch (error) {
       console.log('Error getting class assignment responses: ', error)
   }
}


export const getTeacherById = async (teacherId: string) => {
   try {
    const teacher = await databases.getDocument(DATABASE_ID!, TEACHER_COLL_ID!, teacherId)
    return parseStringify(teacher)
   } catch (error) {
       console.log('Error getting teacher by id: ', error)
   }
}

export const getTeacherChartData = async (slotId: string) => {
    try {
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

        const studentsData = await databases.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.greaterThan("$createdAt", sixMonthsAgo.toISOString()), Query.equal("slot", slotId)]
        );

        const SubmissionData = await databases.listDocuments(
            DATABASE_ID!,
            CLASS_ASSIGN_SUB_COLL_ID!,
            [
                Query.greaterThan("$createdAt", sixMonthsAgo.toISOString()),
            ]
        );
        const submissions = SubmissionData.documents.filter((doc: any) => doc.Student.slot !== slotId);
        const students = await parseStringify(studentsData.documents);
        const assignmentSubmissions = await parseStringify(submissions);
        const studentChartdata = await processChartData(students);
        const assignmentSubmissionChartdata = await processChartData(assignmentSubmissions);
        return parseStringify({
            stats: {
                students: studentsData.total,
                assignmentsSubmissions: assignmentSubmissions.length,
            },
            chartData: {
                students: studentChartdata,
                assignmentSubmissions: assignmentSubmissionChartdata,
            },
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
