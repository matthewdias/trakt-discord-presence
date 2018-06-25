const Discord = require('discord.js')
const level = require('level')
const http = require('http')

const db = level('./db')
const client = new Discord.Client()

client.on('ready', () => {
  console.log('Discord client ready')

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
        return {
          application: process.env.DISCORD_RP_CLIENT,
          ...status
        }
      }
    }))
    let activity = activities.filter(activity => activity)[0]

    await client.user.setPresence({ activity })
  }, 15000)
})

client.on("error", console.error);

client.login(process.env.DISCORD_TOKEN)

http.createServer().listen(process.env.PORT)
