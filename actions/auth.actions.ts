'use server'
import { cache } from '../lib/cache';
import { DATABASE_ID, databases, USER_COLLECTION_ID } from '@/lib/appwrite'
import { ID, Query } from 'appwrite'
import bcrypt from 'bcryptjs'
import { parseStringify } from "@/lib/utils";
import { revalidatePath } from 'next/cache';

export async function authenticateUser(email: string, password: string) {
  try {
    const users = await databases.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('email', email)]
    )

    if (users.documents.length === 0) {
      return null
    }

    const user = users.documents[0]
    const passwordMatch = bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        console.log("Password does not match")
      return null
    }

    return {
      name: user.name,
      id: user.$id,
      email: user.email,
      rollNumber: user.rollNumber,
      slot: user.slot,
      role: 'student',
    }
  } catch (error) {
    console.error('Error authenticating user:', error)
    return null
  }
}

export async function createUser(name: string, email: string, password: string, rollNumber: string, classTiming: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await databases.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        name,
        email,
        password: hashedPassword,
        rollNumber,
        slot: classTiming,
      }
    )
    revalidatePath("/teacher")

    revalidatePath("/teacher/students")
    revalidatePath("/admin/students")
    return {
      id: user.$id,
      email: user.email,
      rollNumber: user.rollNumber,
      slot: user.slot,
      name: user.name,
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function authenticateTeacher(email: string, password: string) {
  try {
    const teachers = await databases.listDocuments(
      DATABASE_ID!,
      "66ebbc31000c53f498cd",
      [Query.equal('email', email)]
    )

    if (teachers.documents.length === 0) {
      return null
    }

    const teacher = teachers.documents[0]
    const passwordMatch = password === teacher.password

    if (!passwordMatch) {
      return null
    }

    return {
      id: teacher.$id,
      email: teacher.email,
      name: teacher.name,
      slots: teacher.slots,
    }
  } catch (error) {
    console.error('Error authenticating teacher:', error)
    return null
  }
}


export async function getUserByEmail(email: string) {
  try {
    const user = await databases.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [Query.equal('email', email)]);
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}
interface Student {
    Student_Registration_Number: string;
    Quarter_1_Exam_Result: string;
  }

  interface JsonData {
    [sheetName: string]: Student[];
  }

  async function fetchJsonFile(): Promise<JsonData> {
    const cacheKey = 'studentDataJsonFile';
    const cachedResponse = cache.get<JsonData>(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const response = await fetch("https://gist.githubusercontent.com/GrowWidTalha/06a4af8613d3decb2db1fbcb0c203482/raw/3e673788ceffe17f71700945d4294745cca95090/students.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData: JsonData = await response.json();
      cache.set(cacheKey, jsonData);
      return jsonData;
    } catch (error) {
      console.error('Error fetching student data:', error);
      return {};
    }
  }

  export async function checkRollNumberInJsonFile(rollNumber: string): Promise<boolean> {
    try {
      const jsonData = await fetchJsonFile();

      for (const sheetName in jsonData) {
        const students = jsonData[sheetName];
        const studentExists = students.some(student => {
          return student.Student_Registration_Number === rollNumber; // Added return statement
        });
        if (studentExists) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking roll number:', error);
      return false;
    }
  }
