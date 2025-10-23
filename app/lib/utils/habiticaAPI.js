'use client'
import { habiticaAxios } from './habiticaAxios'
import { removeUserEquippedGear } from './habiticaData'

const createHeader = (habiticaAuth) => {
   console.log(
      "Is this there'x-client: process.env.NEXT_PUBLIC_HABITICA_CLIENT:",
      process.env.NEXT_PUBLIC_HABITICA_CLIENT
   )
   return {
      'x-api-user': habiticaAuth.userId,
      'x-api-key': habiticaAuth.apiKey,
      'x-client': process.env.NEXT_PUBLIC_HABITICA_CLIENT,
   }
}

/* 
Skill Key to Name Mapping

Mage: fireball="Burst of Flames", mpheal="Ethereal Surge", earth="Earthquake", frost="Chilling Frost"

Warrior: smash="Brutal Smash", defensiveStance="Defensive Stance", valorousPresence="Valorous Presence", intimidate="Intimidating Gaze"

Rogue: pickPocket="Pickpocket", backStab="Backstab", toolsOfTrade="Tools of the Trade", stealth="Stealth"

Healer: heal="Healing Light", protectAura="Protective Aura", brightness="Searing Brightness", healAll="Blessing"

Transformation Items: snowball="Snowball", spookySparkles="Spooky Sparkles", seafoam="Seafoam", shinySeed="Shiny Seed"

POST: https://habitica.com/api/v3/user/class/cast/:spellId

Cast "Pickpocket" on a task:
 https://habitica.com/api/v3/user/class/cast/pickPocket?targetId=fd427623...

Cast "Tools of the Trade" on the party:
 https://habitica.com/api/v3/user/class/cast/toolsOfTrade
*/
const spellMap = {
   fireball: 'fireball',
   mpheal: 'mpheal',
   earth: 'earth',
   frost: 'frost',
   smash: 'smash',
   defensiveStance: 'defensiveStance',
   valorousPresence: 'valorousPresence',
   intimidate: 'intimidate',
   pickPocket: 'pickPocket',
   backStab: 'backStab',
   toolsOfTrade: 'toolsOfTrade',
   stealth: 'stealth',
   heal: 'heal',
   protectAura: 'protectAura',
   brightness: 'brightness',
   healAll: 'healAll',
   snowball: 'snowball',
   spookySparkles: 'spookySparkles',
   seafoam: 'seafoam',
   shinySeed: 'shinySeed',
}

export const castSkill = async (skillName, habiticaAuth, target = null) => {
   const headers = createHeader(habiticaAuth)
   const skillKey = spellMap[skillName]

   if (!skillKey) {
      throw new Error(`Invalid skill name: ${skillName}`)
   }

   const res = await habiticaAxios.post(
      `/user/class/cast/${skillKey}${target ? `?targetId=${target}` : ``}`,
      {},
      {
         headers,
      }
   )

   return res?.data
}

export const fetchHabiticaGearData = async () => {
   const habiticaContent = await habiticaAxios.get('/content')
   const habiticaGear = habiticaContent?.data?.data?.gear?.flat

   return habiticaGear
}

export const fetchHabiticaSpellData = async (targetSpell) => {
   let foundSpell = null

   const habiticaContent = await habiticaAxios.get('/content')

   const habiticaSpells = habiticaContent.data.data.spells

   for (const spellType in habiticaSpells) {
      for (const spell in habiticaSpells[spellType]) {
         if (habiticaSpells[spellType]?.[spell]?.key === targetSpell)
            foundSpell = habiticaSpells[spellType][spell]
      }
   }

   return foundSpell
}

export const fetchUserData = async (habiticaAuth) => {
   const headers = createHeader(habiticaAuth)

   const userData = await habiticaAxios.get('/user/anonymized', {
      headers,
   })

   return userData?.data?.data?.user
}

export const fetchUsersTasks = async (habiticaAuth) => {
   const headers = createHeader(habiticaAuth)

   const tasks = await habiticaAxios.get('/tasks/user', {
      headers,
   })

   return tasks?.data?.data
}

export const equip = async (gear, habiticaAuth) => {
   const headers = createHeader(habiticaAuth)

   const res = await habiticaAxios.post(
      `/user/equip/equipped/${gear}`,
      {},
      { headers }
   )

   removeUserEquippedGear()

   return res?.data?.data?.gear?.equipped
}

export const fetchPartyMembers = async (partyId, habiticaAuth) => {
   const headers = createHeader(habiticaAuth)

   const res = await habiticaAxios.get(
      `/groups/${partyId}/members?includeAllPublicFields=true`,
      { headers }
   )

   return res?.data?.data
}
