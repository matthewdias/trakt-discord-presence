const discordRichPresence = require('discord-rich-presence')
const level = require('level')
const http = require('http')

const db = level('./db')
const client = discordRichPresence(process.env.DISCORD_CLIENT)

if (!process.env.SERVICES) {
  console.log('No services enabled')
  return
}

let enabled = process.env.SERVICES.split(',')
let servs = enabled.map((service) => {
  let Service = require('./services/' + service.trim())
  return new Service(db)
})

setInterval(async () => {
  let activities = await Promise.all(servs.map(async (service) => {
    let status = await service.getStatus()
      if (status) {
        return status
      }
    }))
  let activity = activities.filter(activity => activity)[0]

  await client.updatePresence(activity)
}, 15000)

http.createServer().listen(process.env.PORT)
