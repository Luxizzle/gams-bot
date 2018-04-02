// prettier-ignore
core.add(new Command('ping'))
  .options({
    shortDescription: 'Check if bot is alive'
  })
  .permission({
    OR: {
      user_id: [process.env.OWNER_ID],
      permission: {
        administrator: true
      }
    }
  })
  .action(() => 'Pong!');
