module.exports = core
  .add(new Command(['debug', '~']))
  .options({
    guildOnly: true,
    shortDescription: 'Debug commands',
    description: 'Collective command, this command does nothing.',
  })
  .permission({ custom: () => false })
  .action(() => 'Collective command, this command does nothing.');
