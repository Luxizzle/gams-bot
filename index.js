require('dotenv').config()

const Eris = require('eris')
const glob = require('fast-glob')
const debug = require('debug')('bot')
const del = require('del')

const package = require('./package.json')

var bot = new Eris.CommandClient(process.env.DISCORD_TOKEN, {}, {
  description: package.description,
  owner: package.author,
  prefix: "@mention "
})

global.bot = bot

// Load commands
glob('./commands/**/*.cmd.js')
  .then((files) => {
    return Promise.all(files.map(async (file) => {
      debug('Loading file %s', file)

      require(file)
    }))
  })
  .then(() => {
    debug('Loaded all commands')
  })
  .catch(err => {
    console.error(err)
  })

process.stdin.resume()
function exitHandler(code) {
  // clean up voice connections
  let clients = require('./commands/music/play.cmd')
  for (let client of clients) {
    client.disconnect()
  }

  del.sync('tmp')

  // disconnect ws
  bot.disconnect({ reconnect: false })

  debug('Disconnecting bot')

  process.exit()
}
process.on('SIGINT', exitHandler)
process.on('beforeExit', exitHandler)
process.on('exit', (code) => debug('Exiting with code %d', code))

bot.on('ready', () => {
  debug('Bot is running')

  // bot.editSelf({ avatar: require('image-to-uri')('assets/avatar.png') })

})
bot.connect()