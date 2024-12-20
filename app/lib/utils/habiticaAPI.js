'use client'
import axios from 'axios'
import { removeUserEquippedGear } from './habiticaData'

const createHeader = (habiticaAuth) => {
   return {
      'x-api-user': habiticaAuth.userId,
      'x-api-key': habiticaAuth.apiKey,
      'x-client': process.env.NEXT_PUBLIC_HABITICA_CLIENT,
   }
}

export const fetchHabiticaGearData = async () => {
   const habiticaContent = await axios.get(
      'https://habitica.com/api/v3/content'
   )
   const habiticaGear = habiticaContent.data.data.gear.flat

   return habiticaGear
}

export const fetchUserData = async (habiticaAuth) => {
   const headers = createHeader(habiticaAuth)

   const userData = await axios.get(
      'https://habitica.com/api/v3/user/anonymized',
      {
         headers,
      }
   )

   return userData.data.data.user
}

export const equip = async (gear, habiticaAuth) => {
   const headers = createHeader(habiticaAuth)

   const res = await axios.post(
      `https://habitica.com/api/v3/user/equip/equipped/${gear}`,
      {},
      { headers }
   )

   removeUserEquippedGear()

   return res.data.data.gear.equipped
}
