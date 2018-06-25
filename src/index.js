const discordRichPresence = require('discord-rich-presence')
const level = require('level')
const http = require('http')
const Trakt = require('./Trakt')

const db = level('./db')
const client = discordRichPresence(process.env.DISCORD_CLIENT)
const trakt = new Trakt(db)

setInterval(async () => {
  let status = await trakt.getStatus()
  if (status) {
    client.updatePresence(status)
  }
}, 15000)

http.createServer().listen(process.env.PORT)
