const debug = require('../debug.cmd');

debug
  .add(new Command(['remove-role', 'rr']))
  .options({
    shortDescription: 'Remove a role from a user.',
  })
  .permission({ custom: () => false })
  .arg('member', 'member')
  .arg('role', 'role')
  .action(async (msg, args) => {
    const { member, role } = args;

    try {
      await member.value.removeRole(role.id, 'debug:remove-role');
      return `Removed role ${role.value.name} from ${
        member.value.username
      }`;
    } catch (err) {
      return err;
    }
  });
