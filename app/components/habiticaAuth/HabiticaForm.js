/* Notes: 
   Show if:
      1. There is no user id or api key for habitica
      2. There is no api key but there is a user id
   - This is why it only updates user id if usehabitica has updated it.
*/
'use client'

import { useHabitica } from '@/app/context/habiticaAuth'
import { getHabiticaAuth } from '@/app/lib/services/dbService'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function HabiticaForm() {
   const { data: session } = useSession()
   const { habiticaAuth, updateHabiticaAuth } = useHabitica()

   const [userId, setUserId] = useState(habiticaAuth.userId || '')
   const [apiKey, setApiKey] = useState('')

   const handleSubmit = (e) => {
      e.preventDefault()

      updateHabiticaAuth({
         userId,
         apiKey,
      })
   }

   const handleFetch = async () => {
      const habiticaAuth = await getHabiticaAuth()

      if (!habiticaAuth) {
         alert(
            'You do you not have your habitica userId and api key saved in Habitica Invocation'
         )
      } else {
         updateHabiticaAuth(habiticaAuth)
         setUserId(habiticaAuth.userId || '')
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <div>
            <label htmlFor="habitica_user_id">Habitica User ID:</label>
            <input
               id="habitica_user_id"
               type="text"
               placeholder="Habitica User ID"
               value={userId}
               onChange={(e) => setUserId(e.target.value)}
               required
            />
         </div>
         <div>
            <label htmlFor="habitica_api_key">Habitica API Key:</label>
            <input
               id="habitica_api_key"
               type="password"
               placeholder="Habitica API Key"
               value={apiKey}
               onChange={(e) => setApiKey(e.target.value)}
               required
            />
         </div>

         {session ? (
            <button type="button" onClick={() => handleFetch()}>
               fetch from Habitica Invocation
            </button>
         ) : null}

         <button type="submit">Save</button>
      </form>
   )
}
