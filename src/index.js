const RPC = require('discord-rpc')
const level = require('level')
const http = require('http')
const Trakt = require('./Trakt')

const db = level('./db')
const trakt = new Trakt(db)

let rpc = null

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const connectRPC = async () => {
  try {
    rpc = new RPC.Client({ transport: 'ipc' })
    rpc.on('error', () => { console.log('error') })
    rpc.on('ready', () => {
      console.log('Connected to Discord')
      update()
    })
    await rpc.login({ clientId: process.env.DISCORD_CLIENT })
  } catch (e) {
    console.log("Couldn't connect to Discord")
    await sleep(5000)
    connectRPC()
  }
}

const update = () => {
  let response, prev
  let interval = setInterval(async () => {
    let status = await trakt.getStatus()
    if (status) {
      prev = status
      if (response != 'failed') {
        // setActivity never rejects so check if response was set last time
        response = 'failed'
        response = await rpc.setActivity(status)
      } else {
        clearInterval(interval)
        connectRPC()
      }
    } else {
      if (prev) {
        rpc.clearActivity()
      }
      prev = null
    }
  }, 15000)
}

connectRPC()
http.createServer().listen(process.env.PORT)
