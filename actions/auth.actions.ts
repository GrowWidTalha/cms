'use server'

import { DATABASE_ID, databases, TEACHER_COLL_ID, USER_COLLECTION_ID } from '@/lib/appwrite'
import { ID, Query } from 'appwrite'
import bcrypt from 'bcryptjs'

export async function authenticateUser(email: string, password: string, rollNumber: string, classTiming: string) {
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
    const passwordMatch = password === user.password

    if (!passwordMatch) {
      return null
    }

    if (user.rollNumber !== rollNumber || user.classTiming !== classTiming) {
      return null
    }

    return {
        name: user.name,
      id: user.$id,
      email: user.email,
      rollNumber: user.rollNumber,
      slot: user.slotes.$id,
      role: 'student',
    }
  } catch (error) {
    console.error('Error authenticating user:', error)
    return null
  }
}

export async function createUser(email: string, password: string, rollNumber: string, classTiming: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await databases.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        email,
        password: hashedPassword,
        rollNumber,
        classTiming,
      }
    )

    return {
      id: user.$id,
      email: user.email,
      rollNumber: user.rollNumber,
      classTiming: user.classTiming,
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
    console.log(teachers)

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
