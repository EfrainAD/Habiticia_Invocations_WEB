'use client'

import { useHabitica } from '@/app/context/habiticaAuth'
import { useState } from 'react'

export default function HabiticaForm() {
   const [userId, setUserId] = useState('')
   const [apiKey, setApiKey] = useState('')

   const { updateHabiticaAuth } = useHabitica()

   const handleSubmit = (e) => {
      e.preventDefault()

      updateHabiticaAuth({
         userId,
         apiKey,
      })
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
         <button type="submit">Save</button>
      </form>
   )
}
