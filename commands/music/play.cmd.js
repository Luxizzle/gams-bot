
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
  })

  client.on('finished', (item) => {
    text.createMessage(`Finished playing **${item.title}**`)
  })

  client.on('playlist-add', (item) => {
    text.createMessage(`Added **${item.title}** to playlist`)
  })

  client.on('download-error', (item) => {
    text.createMessage(`Failed to download **${item.title}**`)
  })

  client.on('download-start', (item) => {
    text.createMessage(`Started downloading **${item.title}**`)
  })

  client.on('download-finished', (item) => {
    text.createMessage(`Finished downloading **${item.title}**`)
  })

  return client
}

bot.registerCommand('play', async function(msg, args) {
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
  guildOnly: true
})