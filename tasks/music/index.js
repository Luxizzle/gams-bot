const EventEmitter = require('events').EventEmitter
const debug = require('debug')('bot:music-client')
const p = require('../../util/p')
const ytdl = require('youtube-dl2')
const fs = require('fs-extra')
const path = require('path')

fs.ensureDirSync('tmp/music')

let idCounter = 0

class MusicClient extends EventEmitter {
  constructor() {
    super()

    this.connection = null
    this.ready = false

    this.maxDownloading = 3
    this.downloading = 0

    this.maxDuration = 60 * 5 // 5 minutes

    this.list = []
    this.current = null

    this.emit('ready')
  }

  get playing() { return this.connection ? this.connection.playing : false }

  play() {
    if (!this.connection || !this.ready) return
    if (this.playing) return

    let item = this.list[0]
    if (!item || !item.done) return

    item = this.list.shift()
    this.current = item

    this.emit('playing', item)

    console.log(item.filePath)

    this.connection.play(item.filePath)
  }

  download() {
    if (this.list.length === 0) return
    if (this.downloading >= this.maxDownloading) return

    let item = this.list.find((item) => item.done === false && item.downloading === false)
    if (!item) return

    this.downloading += 1

    item.downloading = true

    this.emit('download-start', item)

    if (fs.existsSync(item.filePath)) {
      item.done = true
      item.downloading = false
      this.downloading -= 1

      this.emit('download-finished', item)
      if (!this.playing) this.play()

      return this.download()
    }
    
    ytdl.file(item.filePath, item.url, { format: 'bestaudio' })
      .then(() => {
        item.done = true
        item.downloading = false

        this.downloading -= 1

        this.emit('download-finished', item)
        if (!this.playing) this.play()

        this.download()
      })
      .catch((err) => {
        this.emit('download-error', item)
        debug(err)

        this.downloading -= 1

        this.list.splice(this.list.findIndex((i) => i.id === item.id), 1)
        this.download()
      })

    this.download()
  }

  async add(url) {
    var [ err, info ] = await p(ytdl.getInfo(url, {
      format: 'bestaudio'
    }))
    if (err) throw err
    if (Array.isArray(info)) return 'Playlists are not supported'

    if (info.duration > this.maxDuration) return 'Audio too long, max 5 minutes.'

    const filePath = path.resolve(path.join('tmp/music', info._filename))

    this.list.push({
      title: info.title,
      url: url,
      filePath,
      done: false,
      downloading: false,
      id: idCounter++
    })

    this.emit('playlist-add', this.list[this.list.length-1])

    this.download()

    return this.list[this.list.length-1]
  }

  remove(i) {

  }

  async connect(channel) {
    this.channel = channel
    var [ err, connection ] = await p(channel.join())
    if (err) throw err
    this.connection = connection
    
    if (this.connection.ready) {
      this.ready = true
    } else {
      this.connection.once('ready', () => this.ready = true)
    }

    this.connection.on('end', () => {
      this.emit('finished', this.current)
      this.current = null
      this.play()
    })
  }

  disconnect() {
    if (this.playing) this.connection.stopPlaying()
    this.channel.leave()

    this.connection = null
    this.channel = null
  }
}

module.exports = MusicClient