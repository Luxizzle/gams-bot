const debug = require('../debug.cmd');

debug
  .add(new Command(['add-role', 'ar']))
  .options({
    shortDescription: 'Add a role from to a user.',
  })
  .permission({ custom: () => false })
  .arg('member', 'member')
  .arg('role', 'role')
  .action(async (msg, args) => {
    const { member, role } = args;

    try {
      await member.value.addRole(role.id, 'debug:add-role');
      return `Added role ${role.value.name} to ${
        member.value.username
      }`;
    } catch (err) {
      return err;
    }
  });
