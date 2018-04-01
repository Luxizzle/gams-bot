// prettier-ignore
core.add(new Command('ping'))
  .permission({
    user_id: [ process.env.OWNER_ID]
  })
  .action(() => 'Pong!');
