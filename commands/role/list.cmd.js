let cmd = require('../role.cmd')

const db = require('../../tasks/db')
const p = require('../../util/p')

let findRole = cmd.findRole
let findRoleIndex = cmd.findRoleIndex

cmd.registerSubcommand('list', async (msg, args) => {
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

  let list = []
  roles.forEach((r, index) => {
    list.push(`${index+1}: ${r.name}` + (r.aliases.length > 0 ? ` (${r.aliases.join(', ')})` : ''))
  })

  if (list.length === 0) {
    return 'No roles set in this guild'
  }

  return list.join('\n')
}, {
  description: 'Give a list of available roles',
  aliases: [  ],
  argsRequired: false
})