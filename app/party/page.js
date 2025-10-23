'use client'
import Image from 'next/image'
import styles from '@/app/page.module.css'
import { useHabitica } from '../context/habiticaAuth'
import { getPartyMembers } from '@/app/lib/services/habiticaService.js'
import { useEffect, useState } from 'react'

export default function Page() {
   const { habiticaAuth, isHabiticaAuth } = useHabitica()
   const [message, setMessage] = useState('')
   const [inactiveMembers, setInactiveMembers] = useState([])

   useEffect(()=> {
      const handleFetchGroup = async () => {
         setMessage('Looking up members...')
         try {
            const partyMembers = await getPartyMembers(habiticaAuth)
            
            const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
            const now = Date.now()
            const filteredMembers = partyMembers.filter((member) => 
               member.auth?.timestamps?.loggedin < (now - ONE_MONTH_MS)
            )
            setInactiveMembers(filteredMembers)

            setMessage(
               ``
            )
         } catch (error) {
            console.log({ error })

            setMessage(
               `Failed to get members info!\nError Message: ${error.response?.data?.message}`
            )
         }
      }
      
      if (isHabiticaAuth) handleFetchGroup()
      else setMessage('Need Habitica auth to check in on your pary.')
   }, [isHabiticaAuth, habiticaAuth])

   return (
      <div className={styles.page}>
         <main className={styles.main}>
            <h1>Party Members</h1>
            <p>Member that have not been on in 30 days are marked as inactive.</p>
            <ul>
               {inactiveMembers.map((partyMember, index) => (   
                  <li key={partyMember._id}> {index + 1}: <strong>Name:</strong> {partyMember.profile?.name} <strong>Username:</strong> {partyMember.auth.local.username} <strong>Last Logged In:</strong> {partyMember.auth?.timestamps?.loggedin.toDateString()}
                     </li>
               ))}
            </ul>
            {message && 
               <pre>
                  <p>{message}</p>
               </pre>
            }
         </main>
      </div>
   )
}
