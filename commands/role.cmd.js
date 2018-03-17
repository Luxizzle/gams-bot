const db = require('../tasks/db')
const p = require('../util/p')
const trim = require('../util/trim')

let int = (integer) => /^-?\d+$/.test(integer) ? parseInt(integer, 10) : undefined 

/**
 * {
 *   id: 'ID_HERE',
 *   name: 'NAME_HERE',
 *   aliases: [ 'ALIAS_HERE' ]
 * }
 */

function findRole(roles, guild, arg) {
  let role = roles.find((r, index) => {
    let guildRole = getRole(guild, r.id)

    let name = guildRole ? guildRole.name : r.name

    if (int(arg) === (index+1)) return true
    if (r.id === arg) return true
    if (r.name === name) return true
    return false
  })

  return role
}

function findRoleIndex(roles, guild, arg) {
  let role = roles.findIndex((r, index) => {
    let guildRole = getRole(guild, r.id)

    let name = guildRole ? guildRole.name : r.name

    if (int(arg) === (index+1)) return true
    if (r.id === arg) return true
    if (r.name === name) return true
    if (r.aliases.indexOf(arg) > -1) return true
    return false
  })

  return role
}

function getRole(guild, id) {
  return guild.roles.find((r) => r.id === id)
}

// ROLE GIVING

let cmd = bot.registerCommand("role", async (msg, args) => {
  // CHECKING

  let arg = args.join(' ')

  if (!args.length === 0) {
    msg.channel.createMessage('First argument should be a role')
    return
  }

  var [ err, roles ] = await p(db.get(`roles:${msg.channel.guild.id}`))
  if ( (err && err.notFound) || roles.length === 0 ) {
    msg.channel.createMessage( 'No roles set in this guild')
    return
  } else if ( err ) {
    msg.channel.createMessage('Something went wrong when trying to fetch roles. Try again.')
    console.error(err)
    return
  }

  let role = findrole(roles, msg.channel.guild, arg)

  if (!role) {
    msg.channel.createMessage('No role found with that name')
    return
  }

  // EXECUTION

  let member = msg.member

  if (member.roles.indexOf(role.id) > -1) { // remove role
    var [ err, result ] = await p(member.removeRole(role.id), 'bot:role invoked')
    if (err) {
      msg.channel.createMessage('Something went wrong when trying to remove the role.')
      console.error(err)
      return
    }
    return `Removed role ${role.name}`
  } else { // add role
    var [ err, result ] = await p(member.addRole(role.id), 'bot:role invoked')
    if (err) {
      msg.channel.createMessage('Something went wrong when trying to add the role.')
      console.error(err)
      return
    }
    return `Added role ${role.name}`
  }

}, {
  description: 'Toggle a role',
  fullDescription: trim(`
    Give or remove a role.
    Argument should be index, name, id or alias of role.
    For roles use \`role list\'.
  `),
  aliases: [ 'role', 'iam' ],
  argsRequired: true,
  guildOnly: true
})

module.exports = cmd

module.exports.findRole = findRole
module.exports.findRoleIndex = findRoleIndex
module.exports.getRole = getRole