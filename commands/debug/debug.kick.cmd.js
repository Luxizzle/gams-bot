const debug = require('./debug.cmd');

debug
  .add(new Command('kick'))
  .options({
    guildOnly: true,
    shortDescription: 'Kick, what do you expect?',
  })
  .permission({ custom: () => false })
  .arg('member', 'member')
  .arg('reason', 'string', true)
  .action(async (msg, args) => {
    const member = args.member.value;
    const reason = args.reason ? args.reason.value : 'debug:kick';

    try {
      await member.kick(reason);
      return `Kicked ${member.username}#${
        member.discriminator
      } for "${reason}"`;
    } catch (err) {
      return err;
    }
  });
