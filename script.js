// -- Util Functions -- ||
const createTopGearsObj = (stats, gearTypes) => {
   const gearObj = {}

   stats.forEach((stat) => {
      gearObj[stat] = {}

      gearTypes.forEach((gearType) => {
         gearObj[stat][gearType] = {}
      })

      gearObj.weapon = { oneHanded: {}, twoHanded: {} }
   })

   return gearObj
}

const isObjEmpty = (obj) => Object.keys(obj).length < 1

const parseQuest = (habatica) => {
   const stats = ['str', 'con', 'int', 'per']
   const gearTypes = habatica.gearTypes
   const gears = habatica.gear.flat
   const topGear = createTopGearsObj(stats, gearTypes)
   const questNames = Object.keys(habatica.quests)

   const allQuests = questNames.map((questName) => habatica.quests[questName])
   const questsWithGearDrops = allQuests.filter((quest) => {
      const isUnlockableOrGold =
         quest.category === 'unlockable' || quest.category === 'gold'
      const hasGearDrop = quest.drop?.items

      return isUnlockableOrGold && hasGearDrop
   })

   const drops = questsWithGearDrops.reduce((acc, quest) => {
      const gears = quest.drop.items.filter(
         (dropItem) => dropItem.type === 'gear'
      )

      gears.forEach((gear) => {
         gear.quest = { key: quest.key, text: quest.text }
      })

      return acc.concat(gears)
   }, [])

   // find the highest stat gear for each stat
   drops.forEach((drop) => {
      const gear = { ...gears[drop.key], quest: drop.quest }
      const gearType = gear.type

      stats.forEach((stat) => {
         if (gear[stat] > 0) {
            if (isObjEmpty(topGear[stat][gearType])) {
               topGear[stat][gearType] = gear
            } else if (gear[stat] > topGear[stat][gearType][stat]) {
               topGear[stat][gearType] = gear
            }
         }
      })
   })
   return topGear
}

fetch('https://habitica.com/api/v3/content')
   .then((res) => res.json())
   .then((habaticaData) => {
      const gears = parseQuest(habaticaData.data)
      console.log({ gears })
   })
