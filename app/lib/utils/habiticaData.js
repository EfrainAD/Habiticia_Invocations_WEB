import { fetchUserData } from './habiticaAPI'

import { fetchHabiticaGearData as fetchHabiticaGearData } from '@/app/lib/utils/habiticaAPI'

export const getGearData = async () => {
   let value = localStorage.getItem('habiticaGear')

   if (value === null) {
      const habiticaGear = await fetchHabiticaGearData()

      localStorage.setItem('habiticaGear', JSON.stringify(habiticaGear))

      value = localStorage.getItem('habiticaGear')

      if (value === null) {
         throw new Error('Error, unable to get habitica user data')
      }
   }

   value = await JSON.parse(value)

   return value
}

export const getUserBestGearByStat = async ({ userClass, stat, ownedGear }) => {
   const gearContent = await getGearData()

   const ownedHighestGearByStat = parseUserHighestGearByStat(
      userClass,
      stat,
      usersGear,
      gearContent
   )

   const optimalGearSetup = getBestWeaponOption({
      gear: ownedHighestGearByStat,
      stat: stat,
   })

   return formatGear(optimalGearSetup)
}

const updateUserHabiticaData = async (habiticaAuth) => {
   const user = await fetchUserData(habiticaAuth)

   // Add localStorage
   localStorage.setItem('userClass', user.stats.class)
   localStorage.setItem('ownedGear', JSON.stringify(user.items.gear.owned))
   localStorage.setItem(
      'equippedGear',
      JSON.stringify(user.items.gear.equipped)
   )
}

export const getUserClass = async (habiticaAuth) => {
   let value = localStorage.getItem('userClass')

   if (value === null) {
      await updateUserHabiticaData(habiticaAuth)

      value = localStorage.getItem('userClass')
   }

   return value
}

export const getOwnedGear = async (habiticaAuth) => {
   let value = localStorage.getItem('ownedGear')

   if (value === null) {
      await updateUserHabiticaData(habiticaAuth)

      value = localStorage.getItem('ownedGear')
   }

   if (value === null) {
      throw new Error('Error, unable to get habitica user data')
   }

   value = await JSON.parse(value)

   return value
}

export const removeUserEquippedGear = () => {
   localStorage.removeItem('equippedGear')
}
export const getUserEquippedGear = async (habiticaAuth) => {
   let value = localStorage.getItem('equippedGear')

   if (value === null) {
      await updateUserHabiticaData(habiticaAuth)

      value = localStorage.getItem('equippedGear')
   }

   if (value === null) {
      throw new Error('Error, unable to get habitica user data')
   }

   value = await JSON.parse(value)

   return value
}
