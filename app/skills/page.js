'use client'
import styles from '@/app/page.module.css'
import { useHabitica } from '../context/habiticaAuth'
import { castSkillAllOut } from '@/app/lib/services/habiticaService.js'
import { useState } from 'react'

export default function Page() {
   const { habiticaAuth } = useHabitica()
   const [message, setMessage] = useState('')
   const [targetManaLeftover, setTargetManaLeftover] = useState(0)

   const skillMap = {
      fireball: 'Burst of Flames',
      mpheal: 'Ethereal Surge',
      earth: 'Earthquake',
      frost: 'Chilling Frost',
      smash: 'Brutal Smash',
      defensiveStance: 'Defensive Stance',
      valorousPresence: 'Valorous Presence',
      intimidate: 'Intimidating Gaze',
      pickPocket: 'Pickpocket',
      backStab: 'Backstab',
      toolsOfTrade: 'Tools of the Trade',
      stealth: 'Stealth',
      heal: 'Healing Light',
      protectAura: 'Protective Aura',
      brightness: 'Searing Brightness',
      healAll: 'Blessing',
      snowball: 'Snowball',
      spookySparkles: 'Spooky Sparkles',
      seafoam: 'Seafoam',
      shinySeed: 'Shiny Seed',
   }

   const handleCastingSkill = async (skillName) => {
      setMessage('Casting...')
      try {
         const maxCast = await castSkillAllOut(
            skillName,
            habiticaAuth,
            targetManaLeftover
         )

         setMessage(
            `${skillMap[skillName]} has been casted! ${maxCast} number of times!`
         )
      } catch (error) {
         console.log({ error })

         setMessage(
            `Failed in casting skills!\nSome or all of the skills may have been casted.\nError Message: ${error.response.data.message}`
         )
      }
   }

   const handleManaChange = (e) => {
      const sanitizedValue = e.target.value.replace(/[^0-9]/g, '')
      const numberValue = Number(sanitizedValue)

      setTargetManaLeftover(numberValue)
   }

   return (
      <div className={styles.page}>
         <main className={styles.main}>
            <h1>Cast Skills</h1>
            <p>Cast skill until {`you're`} out of mana</p>
            {message ? (
               <pre>
                  <p>{message}</p>
               </pre>
            ) : null}
            <div
               style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
               }}
            >
               <label htmlFor="manaInput">
                  If you want mana left over, You can put how much mana you want
                  left over after casting.
               </label>
               <input
                  id="manaInput"
                  type="text"
                  inputMode="numeric"
                  style={{ maxWidth: '100px', textAlign: 'center' }}
                  value={targetManaLeftover}
                  onChange={handleManaChange}
               />
            </div>
            <div>
               {[
                  'fireball',
                  'mpheal',
                  'earth',
                  'frost',
                  'smash',
                  'defensiveStance',
                  'valorousPresence',
                  'intimidate',
                  'pickPocket',
                  'backStab',
                  'toolsOfTrade',
                  'stealth',
                  'heal',
                  'protectAura',
                  'brightness',
                  'healAll',
                  'snowball',
                  'spookySparkles',
                  'seafoam',
                  'shinySeed',
               ].map((skill) => (
                  <button
                     key={skill}
                     onClick={() => {
                        handleCastingSkill(skill)
                     }}
                  >
                     <a className={styles.primary}>Cast: {skillMap[skill]}</a>
                  </button>
               ))}
            </div>
         </main>
      </div>
   )
}
