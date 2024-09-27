import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "@auth/core/errors";
import {
    authenticateUser,
    authenticateTeacher,
    checkRollNumberInJsonFile,
    getUserByEmail,
    createUser,
} from "./actions/auth.actions";
class InvalidCredentialsError extends CredentialsSignin {
    code = "InvalidCredentials"
  }

  class UnregisteredStudentError extends CredentialsSignin {
    code = "UnregisteredStudent"
  }

  class EmailExistsError extends CredentialsSignin {
    code = "EmailExists"
  }

  class InvalidTeacherCredentialsError extends CredentialsSignin {
    code = "InvalidTeacherCredentials"
  }

export const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    const { name, email, password, rollNumber, classTiming, role, type } =
                        credentials as {
                            name: string;
                            email: string;
                            password: string;
                            rollNumber: string;
                            classTiming: string;
                            role: string;
                            type: string;
                        };
                    if (role === "student") {
                        if (type === "login") {
                            const student = await authenticateUser(
                                email,
                                password,
                            );
                            if (!student) {
                                throw new InvalidCredentialsError()
                              }
                            return {
                                id: student.id,
                                name: student.name,
                                email: student.email,
                                role: "student",
                                rollNumber: student.rollNumber,
                                slots: student.slot,
                            };
                        } else if (type === "signup") {
                            const userExists = await checkRollNumberInJsonFile(
                                rollNumber
                            );
                            console.log("USER exists", userExists);

                            if (!userExists) {
                                throw new UnregisteredStudentError()
                              }
                            const user = await getUserByEmail(email);
                            if (user) {
                                throw new EmailExistsError()
                              }
                            const student = await createUser(
                                name,
                                email,
                                password,
                                rollNumber,
                                classTiming,
                            );
                            if (!student) {
                                throw new Error("Error creating user");
                            }
                            return {
                                id: student.id,
                                name: student.name,
                                email: student.email,
                                role: "student",
                                rollNumber: student.rollNumber,
                                slots: student.slot,
                            };
                        }
                    } else if (role === "teacher") {
                        const teacher = await authenticateTeacher(email, password);
                        if (!teacher) {
                            throw new InvalidTeacherCredentialsError()
                          }
                        return {
                            id: teacher.id,
                            name: teacher.name,
                            email: teacher.email,
                            role: "teacher",
                            slots: teacher.slots,
                        };
                    }
                    throw new Error("Invalid role");
                } catch (error: any) {
                    if (error instanceof CredentialsSignin) {
                        throw error; // Re-throw custom errors
                      }
                      throw new CredentialsSignin("An unexpected error occurred");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.slots = user.slots;
                token.name = user.name;
                token.email = user.email;
                token.rollNumber = user.rollNumber;
                token.classTiming = user.classTiming;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.slots = token.slots
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.rollNumber = token.rollNumber as string;
                session.user.classTiming = token.classTiming as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
