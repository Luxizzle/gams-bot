const rolesDb = require('../../tasks/roles');
const p = require('../../util/p');

let roleCommand = core
  // Main giving command
  .add(new Command('role'))
  .options({
    guildOnly: true,
    shortDescription: 'Give or remove a role',
  })
  .arg('role', 'role')
  .action(async (msg, { role }) => {
    let author = msg.member;
    let guildId = msg.channel.guild.id;
    let roleId = role.value.id;
    let roleName = role.value.name;

    let [dbErr, dbResult] = await p(rolesDb.get(guildId, roleId));
    if (dbErr) return dbErr;
    if (!dbResult) return `${roleName} is not a valid giveable role.`;

    if (author.roles.indexOf(roleId) > -1) {
      // Author has the role
      let [err] = await p(
        author.removeRole(roleId, 'Remove giveable role.')
      );
      if (err) return err;
      return `Removed role ${roleName}.`;
    } else {
      // Author doesnt have the role
      let [err] = await p(
        author.addRole(roleId, 'Add giveable role.')
      );
      if (err) return err;
      return `Added role ${roleName}.`;
    }
  });

module.exports = roleCommand;
