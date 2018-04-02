const HelpTemplate = require('../help-template');

core
  .add(new Command(['help', '?']))
  .options({
    weight: -999,
    sendToDM: true,

    shortDescription: 'You are here now',
  })
  .template(HelpTemplate)
  .action(() => {
    const owner = bot.users.find(
      user => user.id === process.env.OWNER_ID
    );

    return {
      description: `**Strelizia** - Simple bot${
        owner ? ` by ${owner.username}#${owner.discriminator}` : ''
      }.`,
      commands: core.commands,
    };
  });
