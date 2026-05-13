import type { H3Event } from 'h3'
import { useSession } from 'h3'

export interface SessionData {
  userId: string
  email: string
  role: string
}

export async function getUserSession(event: H3Event) {
  return useSession<SessionData>(event, {
    password: process.env.SESSION_SECRET || 'default-secret-password-at-least-32-chars-long!',
    name: 'nuxt-session',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}
