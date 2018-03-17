let cmd = require('../role.cmd')

const db = require('../../tasks/db')
const p = require('../../util/p')

let findRole = cmd.findRole
let findRoleIndex = cmd.findRoleIndex

cmd.registerSubcommand('add', async (msg, args) => {
  // CHECKING

  let arg = args.join(' ')

  if (!args.length === 0) {
    msg.channel.createMessage('First argument should be a role') 
    return
  }

  var [ err, roles ] = await p(db.get(`roles:${msg.channel.guild.id}`))
  if ( (err && err.notFound) || !roles || roles.length === 0 ) {
    roles = []
  } else if ( err ) {
    msg.channel.createMessage('Something went wrong when trying to fetch roles. Try again.')
    console.error(err)
    return
  }

  if (findRole(roles, arg)) { 
    msg.channel.createMessage('There is already a role with that name (alias included)')
    return
  }

  let guild = msg.channel.guild
  let guildRole = guild.roles.find((r) => {
    if (r.id === arg) return true
    if (r.name === arg) return true
    return false
  })
  if (!guildRole) { 
    msg.channel.createMessage('No role found with that name or id')
    return
  }

  // EXECUTION

  roles.push({
    name: guildRole.name,
    id: guildRole.id,
    aliases: []
  })
  
  var [ err ] = await p(db.put(`roles:${msg.channel.guild.id}`, roles))
  if (err) {
    msg.channel.createMessage('Something went wrong when trying to save roles. Try again.')
    console.error(err)
    return
  }

  return `Role ${guildRole.name} added to role list`
}, {
  description: 'Add a role to the list of roles',
  aliases: [  ],
  argsRequired: true,
  permissionMessage: 'You do not have permission to use this command.',
  requirements: {
    permissions: {
      administrator: true,
    }
  }
})