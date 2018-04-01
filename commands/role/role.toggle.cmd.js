const rolesDb = require('../../tasks/roles');
const p = require('../util/p');

let roleCommand = require('./role.cmd');

roleCommand
  .add(new Command('toggle'))
  .options({ guildOnly: true })
  .permission({
    permission: ['administrator'],
  })
  .arg('role', 'role')
  .action(async (msg, { role }) => {
    let guildId = msg.channel.guild;
    let roleId = role.value.id;
    let roleName = role.value.name;

    let [err, result] = await p(rolesDb.toggle(guildId, roleId));
    if (err) return err;
    return result
      ? `Added ${roleName} as a giveable role.`
      : `Removed ${roleName} as a giveable role.`;
  });
