const Client = require('trakt.tv')

module.exports = class Trakt {
  constructor(db) {
    this.db = db
    this.client = new Client({
      client_id: process.env.TRAKT_CLIENT,
      client_secret: process.env.TRAKT_SECRET
    })
    this.auth()
  }

  async auth() {
    let access_token, expires, refresh_token
    try {
      access_token = await this.db.get('trakt_token')
      expires = await this.db.get('trakt_expires')
      refresh_token = await this.db.get('trakt_refresh')
    } catch(err) {}

    if (access_token) {
      this.client.import_token({ access_token, expires, refresh_token })
    } else {
      let poll = await this.client.get_codes()
      console.log(`Visit ${poll.verification_url} and enter code: ${poll.user_code}`)
      await this.client.poll_access(poll)

      let { access_token, expires, refresh_token } = this.client.export_token()
      await this.db.put('trakt_token', access_token)
      await this.db.put('trakt_expires', expires)
      await this.db.put('trakt_refresh', refresh_token)
    }

    console.log('Logged in to Trakt')

    let settings = await this.client.users.settings()
    this.username = settings.user.username
  }

  // revoke() {
  //   trakt.revoke_token()
  //   this.db.del('trakt_token')
  // }

  async getStatus() {
    if (!this.username) {
      return
    }

    let watching = await this.client.users.watching({
      username: this.username
    })

    if (watching) {
      if (this.state == 'playing' && this.fingerprint == this.getFingerprint(watching)) {
        return
      }

      console.log('Trakt: playing')
      this.state = 'playing'
      this.fingerprint = this.getFingerprint(watching)
      this.watching = watching

      return {
        ...this.getDetails(watching),
        timestamps: {
          start: new Date(watching.started_at).getTime(),
          end: new Date(watching.expires_at).getTime(),
        },
        assets: {
          ...this.getLargeAssets(),
          smallImage: 'play',
          smallText: 'Playing',
        }
      }
    }

    if (this.watching) {
      if (this.state == 'paused' && this.fingerprint == this.getFingerprint(watching)) {
        return
      }

      console.log('Trakt: paused')
      this.state = 'paused'

      let type = this.watching.type
      let playback = await this.client.sync.playback.get({
        type: type + 's'
      })
      let progress = playback
        .filter(media => media[type].ids.trakt == this.watching[type].ids.trakt)[0]

      if (progress && Date.parse(progress.paused_at) - Date.now() < 600000) {
        return {
          ...this.getDetails(this.watching),
          assets: {
            ...this.getLargeAssets(),
            smallImage: 'pause',
            smallText: 'Paused',
          }
        }
      } else {
        console.log('Trakt: stopped')
        this.state = 'stopped'
        this.fingerprint = null
        this.watching = null
      }
    }
  }

  getDetails(watching) {
    let options = { type: 'WATCHING' }

    if (watching.type == 'episode') {
      let { episode, show } = watching
      options.name = `${show.title} (${show.year})`
      options.details = `Season ${episode.season} Episode ${episode.number}`
      options.state = episode.title
    } else if (watching.type == 'movie') {
      let { movie } = watching
      options.name = `${movie.title} (${movie.year})`
    }

    return options
  }

  getFingerprint(watching) {
    let { type } = watching
    return `${type}/${watching[type].ids.trakt}`
  }

  getLargeAssets() {
    return {
      largeImage: 'trakt',
      largeText: 'Trakt',
    }
  }
}
