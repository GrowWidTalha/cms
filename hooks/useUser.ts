import { useSession } from "next-auth/react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useUser({ redirectTo = '', redirectIfFound = false } = {}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'loading' || isRedirecting) return

    if (
      (redirectTo && !redirectIfFound && !session) ||
      (redirectIfFound && session)
    ) {
      setIsRedirecting(true)
      router.push(redirectTo)
    }
  }, [session, status, redirectIfFound, redirectTo, router, isRedirecting])

  return { user: session?.user, loading: status === 'loading' || isRedirecting }
}
