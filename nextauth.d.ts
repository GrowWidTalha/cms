import { ClassSlot } from "./types/types.appwrite"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    role: 'student' | 'teacher'
    name?: string
    rollNumber?: string
    classTiming?: string
    slots?: ClassSlot
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: 'student' | 'teacher'
      rollNumber?: string
      classTiming?: string
      slot?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    role: 'student' | 'teacher'
    name?: string
    rollNumber?: string
    classTiming?: string
    slot?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rollNumber: { label: "Roll Number", type: "text" },
        classTiming: { label: "Class Timing", type: "text" },
        role: { label: "Role", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null
        }

        let user = null;
        if (credentials.role === 'student') {
          if (!credentials.rollNumber || !credentials.classTiming) {
            return null
          }
          user = await authenticateUser(
            credentials.email,
            credentials.password,
            credentials.rollNumber,
            credentials.classTiming
          )
          if (!user) {
            user = await createUser(
              credentials.email,
              credentials.password,
              credentials.rollNumber,
              credentials.classTiming
            )
          }
        } else if (credentials.role === 'teacher') {
          user = await authenticateTeacher(credentials.email, credentials.password)
        }

        if (!user) {
          throw new Error("Unable to sign in.")
        }

        return {
          id: user.id,
          name: user.name || user.email,
          email: user.email,
          role: credentials.role,
          ...(credentials.role === 'student' && {
            rollNumber: user.rollNumber,
            classTiming: user.classTiming,
          }),
          ...(credentials.role === 'teacher' && {
            slot: user.slots?.$id,
          }),
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        if (user.role === 'student') {
          token.rollNumber = user.rollNumber
          token.classTiming = user.classTiming
        } else if (user.role === 'teacher') {
          token.slot = user.slot
        }
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role
        if (token.role === 'student') {
          session.user.rollNumber = token.rollNumber
          session.user.classTiming = token.classTiming
        } else if (token.role === 'teacher') {
          session.user.slot = token.slot
        }
      }
      return session
    },
  }
})
