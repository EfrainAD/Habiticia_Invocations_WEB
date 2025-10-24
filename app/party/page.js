'use client'
import Image from 'next/image'
import styles from '@/app/page.module.css'
import { useHabitica } from '../context/habiticaAuth'
import { getPartyMembers, removePartyMembers } from '@/app/lib/services/habiticaService.js'
import { useEffect, useState } from 'react'

export default function Page() {
   const { habiticaAuth, isHabiticaAuth } = useHabitica()
   const [message, setMessage] = useState('')
   const [inactiveMembers, setInactiveMembers] = useState([])
   const [refreshToggle, setRefreshToggle] = useState(false)

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
   }, [isHabiticaAuth, habiticaAuth, refreshToggle])


   const removeUser = async (partyMembers, isOneUser) => {
      // Validate
      if (isOneUser !== true && isOneUser !== false)
         throw new Error("removeUser function requries a isOneUser argument of true or false");
         
      const confirmMessage = isOneUser 
         ? `Are you sure you want to remove: ${partyMembers.profile?.name}`
         : 'Are you sure you want to remove ALL inactive members?'
      
      const isConfirmed = confirm(confirmMessage)
      
      if (isConfirmed) {
         await removePartyMembers(partyMembers, habiticaAuth)
         setRefreshToggle(prev => !prev)
      }
   }

   const isInactiveMembers = inactiveMembers.length > 0

   return (
      <div className={styles.page}>
         <main className={styles.main}>
            <h1>Party Members</h1>
            <p>Member that have not been on in 30 days are marked as inactive.</p>
            { isInactiveMembers && <button onClick={() => removeUser(inactiveMembers, false)}>Remove all inactive users</button>}
            {!isInactiveMembers && isHabiticaAuth && <p>There are no inactive members.</p>}
            <ul>
               {inactiveMembers.map((partyMember, index) => (   
                  <li key={partyMember._id}>
                     {index + 1}:{' '} 
                     <strong>Name:</strong> {partyMember.profile?.name}{' '}
                     <strong>Username:</strong> {partyMember.auth.local.username} {' '}
                     <strong>Last Logged In:</strong> {partyMember.auth?.timestamps?.loggedin.toDateString()}{' '}
                     <button onClick={() => removeUser(partyMember, true)}>Remove User</button>
                  </li>
               ))}
            </ul>
            {message && 
                  <p><em>{message}</em></p>
            }
         </main>
      </div>
   )
}
