'use server'
import { getServerSession } from 'next-auth'
import { fetchHabiticaAuth } from '@/app/lib/utils/superbaseAPI.js'

export async function getHabiticaAuth() {
   const session = await getServerSession()

   if (!session) {
      return null
   }

   const habiticaAuth = await fetchHabiticaAuth(session.user)

   return habiticaAuth
}
