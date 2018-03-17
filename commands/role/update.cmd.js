let cmd = require('../role.cmd')

const db = require('../../tasks/db')
const p = require('../../util/p')

let findRole = cmd.findRole
let findRoleIndex = cmd.findRoleIndex
let getRole = cmd.getRole

cmd.registerSubcommand('update', async (msg, args) => {
  // CHECKING

  var [ err, roles ] = await p(db.get(`roles:${msg.channel.guild.id}`))
  if ( (err && err.notFound) || !roles || roles.length === 0 ) {
    roles = []
  } else if ( err ) {
    msg.channel.createMessage('Something went wrong when trying to fetch roles. Try again.')
    console.error(err)
    return
  }

  // EXECUTION

  let newRoles = []
  let updates = []

  for (let role of roles) {
    let guildRole = getRole(msg.channel.guild, role.id)
    if (!guildRole) {
      updates.push(`Removed nonexistant role ${role.name}`)
      continue
    }

    if (role.name !== guildRole.name) updates.push(`Name update for ${guildRole.name} from ${role.name}`)

    newRoles.push({
      name: guildRole.name,
      id: role.id,
      aliases: role.aliases
    })
  }

  var [ err ] = await p(db.put(`roles:${msg.channel.guild.id}`, newRoles))
  if (err) {
    msg.channel.createMessage('Something went wrong when trying to save roles. Try again.')
    console.error(err)
    return
  }

  return `Updated\n` + updates.join('\n')
}, {
  description: 'Update roles. Remove nonexistant roles and update local names.',
  aliases: [  ],
  argsRequired: false,
  permissionMessage: 'You do not have permission to use this command.',
  requirements: {
    permissions: {
      administrator: true,
    }
  },
  guildOnly: true
})