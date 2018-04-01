// prettier-ignore
core.add(new Command('ping'))
  .permission({
    OR: {
      user_id: [process.env.OWNER_ID],
      permission: {
        administrator: true
      }
    }
  })
  .action(() => 'Pong!');
