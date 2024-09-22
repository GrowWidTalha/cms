import { auth } from '@/auth'

export async function getSession() {
    const session = await auth()
  return session
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) {
    return null
  }
  return session.user
}
