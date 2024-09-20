import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authenticateUser, authenticateTeacher } from "./actions/auth.actions"

export const authConfig = {
  providers: [
    Credentials({
      // @ts-ignore
      authorize: async (credentials) => {
        const { email, password, rollNumber, classTiming, role } = credentials as {
          email: string;
          password: string;
          rollNumber: string;
          classTiming: string;
          role: string;
        };
        if (role === 'student') {
            const student = await authenticateUser(email, password, rollNumber, classTiming);
            if(!student) {
                return null;
            }
            return {
              id: student?.id,
              name: student?.email,
              email: student?.email,
              role: 'student',
              rollNumber: student?.rollNumber,
              classTiming: student?.slot,
            }
        } else if (role === 'teacher') {
            const teacher = await authenticateTeacher(email, password);
            if (!teacher) {
                return null;
            }
            return {
              id: teacher?.id,
              name: teacher?.name,
              email: teacher?.email,
              role: 'teacher',
              slots: teacher?.slots,
            }
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
        token.role = user.role;
        token.slots = user.slots;
        // Include other necessary user data
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.slots = token.slots;
        // Include other necessary user data
      }
      console.log("SESSION: ",session)
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
