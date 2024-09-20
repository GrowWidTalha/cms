import { auth } from '@/auth'

export async function getSession() {
    const session = await auth()
    console.log(session)
  return session
}

export async function getCurrentUser() {
  const session = await getSession()
  console.log(session)
  if (!session) {
    return null
  }
  return session.user
}
