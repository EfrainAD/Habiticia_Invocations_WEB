'use client'
import Image from 'next/image'
import styles from '@/app/page.module.css'
import { useHabitica } from '../context/habiticaAuth'
import { EquipBestGearForStat } from '@/app/lib/services/habiticaService.js'
import { useState } from 'react'

export default function Page() {
   const { habiticaAuth } = useHabitica()
   const [message, setMessage] = useState('')

   const handleChangeGear = async (stat) => {
      setMessage('Changing...')
      try {
         await EquipBestGearForStat(stat, habiticaAuth)

         setMessage(
            `Changed your gear that will give you the highest ${stat.toUpperCase()}!`
         )
      } catch (error) {
         console.log({ error })

         setMessage(
            `Failed to change gear!\nError Message: ${error.response.data.message}`
         )
      }
   }

   return (
      <div className={styles.page}>
         <main className={styles.main}>
            <h1>Change Gear</h1>
            <p>Change set up to your best gear for that stat</p>
            {message ? (
               <pre>
                  <p>{message}</p>
               </pre>
            ) : null}

            <div className={styles.ctas}>
               {['int', 'per', 'str', 'con'].map((stat) => (
                  <button
                     key={stat}
                     onClick={() => {
                        handleChangeGear(stat)
                     }}
                  >
                     <a className={styles.primary}>
                        <Image
                           className={styles.logo}
                           src="/vercel.svg"
                           alt="Vercel logomark"
                           width={20}
                           height={20}
                        />
                        Equip {stat.toUpperCase()}
                     </a>
                  </button>
               ))}
            </div>
         </main>
      </div>
   )
}
