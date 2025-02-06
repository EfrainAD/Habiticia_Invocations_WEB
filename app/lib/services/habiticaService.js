import {
   getOwnedGear,
   getUserClass,
   getUserEquippedGear,
   getGearData,
} from '@/app/lib/utils/habiticaData'
import {
   castSkill,
   equip,
   fetchHabiticaSpellData,
   fetchUserData,
   fetchUsersTasks,
} from '@/app/lib/utils/habiticaAPI'

const habiticaAuthErrorMsg = "Your Habitica's user id and api key is required"

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
      throw new Error(habiticaAuthErrorMsg)
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

export const castSkillAllOut = async (
   skillName,
   habiticaAuth,
   targetManaLeftover = 0
) => {
   if (!isHabiticaAuthValid(habiticaAuth)) {
      throw new Error(habiticaAuthErrorMsg)
   }

   const spellInfo = await fetchHabiticaSpellData(skillName)
   const userData = await fetchUserData(habiticaAuth)

   const spellCost = spellInfo.mana
   const mana = userData.stats.mp
   const manaToUse = mana - targetManaLeftover

   const maxCasts = Math.floor(manaToUse / spellCost)
   let targetTaskId = null

   if (spellInfo.target === 'task') {
      const tasks = await fetchUsersTasks(habiticaAuth)

      const bestTask = tasks.reduce((max, task) => {
         if (
            !max &&
            (task.type === 'habit' ||
               task.type === 'daily' ||
               task.type === 'todo')
         ) {
            return task
         } else if (
            task.type === 'habit' ||
            task.type === 'daily' ||
            task.type === 'todo'
         ) {
            return task.value > max.value ? task : max
         } else {
            return max
         }
      }, null)

      targetTaskId = bestTask._id
   }

   for (let i = 0; i < maxCasts; i++) {
      await castSkill(skillName, habiticaAuth, targetTaskId)
      await new Promise((res) => setTimeout(res, 1000))
   }

   return maxCasts
}
