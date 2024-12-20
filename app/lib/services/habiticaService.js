import {
   getOwnedGear,
   getUserClass,
   getUserEquippedGear,
   getGearData,
} from '@/app/lib/utils/habiticaData'
import { equip } from '@/app/lib/utils/habiticaAPI'

const isHabiticaAuthValid = (authObj) => {
   const { userId, apiKey } = authObj
   return userId === '' || apiKey === '' ? false : true
}

const formatGears = (gearObj) => {
   const allGearTypes = Object.keys(gearObj)
   const newGearObj = {}

   for (const gearType of allGearTypes) {
      const gear = gearObj[gearType]

      if (gear?.key) {
         newGearObj[gearType] = gear.key
      }
   }

   return newGearObj
}

export const equipGears = async ({
   gearsToEquip,
   equipedGears,
   habiticaAuth,
}) => {
   const allGearTypes = Object.keys(gearsToEquip)

   for (const gearType of allGearTypes) {
      const gear = gearsToEquip[gearType]
      const equipedGear = equipedGears[gearType]

      if (gear !== equipedGear) {
         await equip(gear, habiticaAuth)
      }
   }
}
// Notes: Habatica toggles equiping and unequiping, so you need make sure if the gear is already equiped to not send the request for that gear.

// Some weapons are two handed. Option 1: weapon + shield, Option 2: just two handed weapon
const selectBestWeaponAndShield = (gearSet, stat) => {
   // Option One
   const oneHandedWeaponStat = gearSet.oneHandedWeapon?.[stat] || 0
   const shieldStat = gearSet.shield[stat] || 0
   const oneHandedWeaponValue = oneHandedWeaponStat + shieldStat
   //  Option Two
   const twoHandedWeaponValue = gearSet.twoHandedWeapon?.[stat] || 0

   // Determon best option
   const isTwoHandedWeapon = twoHandedWeaponValue > oneHandedWeaponValue

   // new fields
   const weapon = isTwoHandedWeapon
      ? gearSet.twoHandedWeapon
      : gearSet.oneHandedWeapon
   const shield = isTwoHandedWeapon ? null : gearSet.shield

   // remove holders
   delete gearSet.oneHandedWeapon
   delete gearSet.twoHandedWeapon

   return {
      ...gearSet,
      weapon,
      shield,
   }
}

export const EquipBestGearForStat = async (targetStat, habiticaAuth) => {
   if (!isHabiticaAuthValid(habiticaAuth)) {
      throw new Error("Your Habitica's user id and api key is required")
   }

   const userClass = await getUserClass(habiticaAuth)
   const equippedGear = await getUserEquippedGear(habiticaAuth)
   const ownedGears = Object.keys(await getOwnedGear(habiticaAuth))
   const gearsData = await getGearData()

   let bestGearByStat = {
      oneHandedWeapon: null,
      twoHandedWeapon: null,
      armor: null,
      head: null,
      shield: null,
      back: null,
      body: null,
      headAccessory: null,
      eyewear: null,
   }

   // Get the highest gear by type for the requested stat
   for (const gearKey of ownedGears) {
      const gear = gearsData[gearKey]
      const { type, twoHanded } = gear
      const objectPath =
         type === 'weapon'
            ? twoHanded
               ? 'twoHandedWeapon'
               : 'oneHandedWeapon'
            : type
      const currentBestGear = bestGearByStat[objectPath]

      if (gear[targetStat] <= 0) continue

      // Class Bonus
      if (gear.klass === userClass) {
         gear[targetStat] += gear[targetStat] / 2
      }

      if (!currentBestGear || gear[targetStat] > currentBestGear[targetStat]) {
         bestGearByStat[objectPath] = gear
      }
   }

   // best weapon option
   bestGearByStat = selectBestWeaponAndShield(bestGearByStat, targetStat)

   await equipGears({
      gearsToEquip: formatGears(bestGearByStat),
      equipedGears: equippedGear,
      habiticaAuth,
   })

   return {
      postEquipGear: equippedGear,
      equippedGear: bestGearByStat,
   }
}
