const RPC = require('discord-rpc')
const level = require('level')
const http = require('http')
const Trakt = require('./Trakt')

const db = level('./db')
const rpc = new RPC.Client({ transport: 'ipc' })
const trakt = new Trakt(db)

rpc.on('error', console.log)
rpc.login({ clientId: process.env.DISCORD_CLIENT })

setInterval(async () => {
  let status = await trakt.getStatus()
  if (status) {
    rpc.setActivity(status)
  }
}, 15000)

http.createServer().listen(process.env.PORT)
