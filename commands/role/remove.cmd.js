let cmd = require('../role.cmd')

const db = require('../../tasks/db')
const p = require('../../util/p')

let findRole = cmd.findRole
let findRoleIndex = cmd.findRoleIndex

cmd.registerSubcommand('remove', async (msg, args) => {
  // CHECKING

  let arg = args.join(' ')

  if (!args.length === 0) {
    msg.channel.createMessage('First argument should be a role')
    return
  }

  var [ err, roles ] = await p(db.get(`roles:${msg.channel.guild.id}`))
  if ( (err && err.notFound) || !roles || roles.length === 0 ) {
    msg.channel.createMessage( 'No roles set in this guild')
    return
  } else if ( err ) {
    msg.channel.createMessage('Something went wrong when trying to fetch roles. Try again.')
    console.error(err)
    return
  }

  if (!findRole(roles, msg.channel.guild, arg)) {
    msg.channel.createMessage('No role found with that name')
    return
  }

  // EXECUTION

  let roleIndex = findRoleIndex(roles, msg.channel.guild, arg)

  roles.splice(roleIndex, 1)

  var [ err ] = await p(db.put(`roles:${msg.channel.guild.id}`, roles))
  if (err) {
    msg.channel.createMessage('Something went wrong when trying to save roles. Try again.')
    console.error(err)
    return
  }

  return `Role ${guildRole.name} removed from role list`
}, {
  description: 'Remove a role to the list of roles',
  aliases: [  ],
  argsRequired: true,
  permissionMessage: 'You do not have permission to use this command.',
  requirements: {
    permissions: {
      administrator: true,
    }
  },
  guildOnly: true
})