import { defineEventHandler } from 'h3'
import { getRequestProfile } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const profile = await getRequestProfile(event)

  return {
    profile,
  }
})
