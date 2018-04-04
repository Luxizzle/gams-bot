const debug = require('./debug.cmd');

debug
  .add(new Command('ban'))
  .options({
    guildOnly: true,
    shortDescription: 'Ban, what do you expect?',
  })
  .permission({ custom: () => false })
  .arg('member', 'member')
  .arg('reason', 'string', true)
  .action(async (msg, args) => {
    const member = args.member.value;
    const reason = args.reason ? args.reason.value : 'debug:ban';

    try {
      await member.ban(7, reason);
      return `Banned ${member.username}#${
        member.discriminator
      } for "${reason}"`;
    } catch (err) {
      return err;
    }
  });
