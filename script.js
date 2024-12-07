const stats = ['str', 'con', 'int', 'per']

// -- Util Functions -- ||
const createTopGearsObj = (stats, gearTypes) => {
   const gearObj = {}

   stats.forEach((stat) => {
      gearObj[stat] = {}

      gearTypes.forEach((gearType) => {
         gearObj[stat][gearType] = {}
      })

      gearObj[stat].weapon = { oneHanded: {}, twoHanded: {} }
   })

   return gearObj
}

const isObjEmpty = (obj) => Object.keys(obj).length < 1

const parseQuest = (habatica) => {
   const gears = habatica.gear.flat
   const topGear = createTopGearsObj(stats, habatica.gearTypes)
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
         gear.quest = { key: quest.key, text: quest.text, type: quest.category }
      })

      return acc.concat(gears)
   }, [])

   // find the highest stat gear for each stat
   drops.forEach((drop) => {
      const gear = { ...gears[drop.key], quest: drop.quest }
      const gearType = gear.type

      stats.forEach((stat) => {
         if (gear[stat] > 0) {
            if (gear.type === 'weapon') {
               const weaponType = gear.twoHanded ? 'twoHanded' : 'oneHanded'

               if (isObjEmpty(topGear[stat].weapon[weaponType])) {
                  topGear[stat].weapon[weaponType] = gear
               } else if (gear[stat] > topGear[stat].weapon[weaponType][stat]) {
                  topGear[stat].weapon[weaponType] = gear
               }
            } else {
               // gear.type !== 'weapon'
               if (isObjEmpty(topGear[stat][gearType])) {
                  topGear[stat][gearType] = gear
               } else if (gear[stat] > topGear[stat][gearType][stat]) {
                  topGear[stat][gearType] = gear
               }
            }
         }
      })
   })
   stats.forEach((stat) => {
      const arr = []
      habatica.gearTypes.forEach((gearType) => {
         const gear = topGear[stat][gearType]
         // let payload = []
         if (!isObjEmpty(gear)) {
            if (gearType === 'weapon') {
               if (!isObjEmpty(gear.oneHanded)) {
                  arr.push(gear.oneHanded)
               }
               if (!isObjEmpty(gear.twoHanded)) {
                  arr.push(gear.twoHanded)
               }
            } else {
               arr.push(gear)
            }
         }
      })
      topGear[stat] = arr
   })
   return topGear
}

const fillQuestList = (stat, bestQuests, gears) => {
   bestQuests.innerHTML = gears[stat]
      .map((gear) => {
         // Build gear type HTML
         let gearTypeHTML = `<strong>Gear Type: </strong>${gear.type}`
         if (gear.type === 'weapon') {
            gearTypeHTML += gear.twoHanded ? ` (Two Handed)` : ` (One Handed)`
         }

         // Build stats HTML
         const stats = ['int', 'str', 'per', 'con'] // Define the stats array
         const gearStatsHTML = () => {
            let statStr = '<strong>Stats:</strong><br>'
            stats.forEach((statType) => {
               if (gear[statType] > 0) {
                  statStr += `&nbsp;&nbsp;&nbsp;&nbsp;<strong>${statType.toUpperCase()}:</strong> ${
                     gear[statType]
                  }<br>`
               }
            })
            return statStr
         }

         // Build quest HTML
         const questHTML = `
         <strong>Quest:</strong> ${gear.quest.text}<br>
         <strong>Quest Type:</strong> ${gear.quest.type}<br><br>
       `

         // Combine all parts and return
         return gearTypeHTML + '<br>' + gearStatsHTML() + questHTML
      })
      .join('')
}

fetch('https://habitica.com/api/v3/content')
   .then((res) => res.json())
   .then((habaticaData) => {
      const gears = parseQuest(habaticaData.data)

      let stat = 'int'
      const bestQuests = document.querySelector('#best-quests')

      const btns = document.querySelectorAll(
         '.stats-button-filter-wrapper button'
      )

      btns.forEach((btn) => {
         btn.addEventListener('click', (e) => {
            const newStat = e.target.getAttribute('data-stat')

            // Remove active class
            btns.forEach((btn) => btn.classList.remove('selected'))

            // Add active class
            e.target.classList.add('selected')

            fillQuestList(newStat, bestQuests, gears)
         })
      })

      fillQuestList(stat, bestQuests, gears)
   })
