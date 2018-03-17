
let clients = []
let Client = require('../../tasks/music')
const p = require('../../util/p')

module.exports = clients

function connect(text, voice) {
  let client = new Client()
  client.guildID = text.guild.id

  clients.push(client)

  client.connect(voice)

  client.on('playing', (item) => {
    text.createMessage(`Now playing **${item.title}**`)
      .then((msg) => setTimeout(() => msg.delete(), 20 * 1000))
      .catch(err => {})
  })

  client.on('finished', (item) => {
    text.createMessage(`Finished playing **${item.title}**`)
      .then((msg) => setTimeout(() => msg.delete(), 30 * 1000))
      .catch(err => {})
  })

  client.on('playlist-add', (item) => {
    text.createMessage(`Added **${item.title}** to playlist`)
      .then((msg) => setTimeout(() => msg.delete(), 30 * 1000))
      .catch(err => {})
  })

  client.on('playlist-remove', (item) => {
    text.createMessage(`Removed **${item.title}** from playlist`)
      .then((msg) => setTimeout(() => msg.delete(), 30 * 1000))
      .catch(err => {})
  })

  client.on('download-error', (item) => {
    text.createMessage(`Failed to download **${item.title}**`)
      .then((msg) => setTimeout(() => msg.delete(), 30 * 1000))
      .catch(err => {})
  })

  client.on('download-start', (item) => {
    text.createMessage(`Started downloading **${item.title}**`)
      .then((msg) => setTimeout(() => msg.delete(), 30 * 1000))
      .catch(err => {})
  })

  client.on('download-finished', (item) => {
    text.createMessage(`Finished downloading **${item.title}**`)
      .then((msg) => setTimeout(() => msg.delete(), 30 * 1000))
      .catch(err => {})
  })

  client.on('idle', () => {
    text.createMessage('Idled too long, leaving channel.')
      .then((msg) => setTimeout(() => msg.delete(), 30 * 1000))
      .catch(err => {})
  })

  client.on('idle', () => {
    text.createMessage('Everybody left, leaving channel.')
      .then((msg) => setTimeout(() => msg.delete(), 30 * 1000))
      .catch(err => {})
  })

  return client
}

bot.registerCommand('music', async function(msg, args) {
  let url = args[0]

  let client = clients.find((c) => c.guildID === msg.channel.guild.id)
  if (!client && !msg.member.voiceState.channelID) {
    msg.channel.createMessage('You are not in a voice channel')
    return

  } else if (!url) {
    msg.channel.createMessage('Need something to play')
    return
  } else if (!client) {
    let voice = bot.getChannel(msg.member.voiceState.channelID)
    client = connect(msg.channel, voice)
  }

  var [ err, result ] = await p(client.add(url))
  if (err) {
    msg.channel.createMessage('Error while adding to playlist, was the url correct?')
    console.error(err)
    return
  }
  if (typeof result === 'string') {
    msg.channel.createMessage(result)
    return
  }
}, {
  requirements: {
    userIDs: [ process.env.OWNER_ID ]
  },
  guildOnly: true,
  aliases: [ 'play' ]
})