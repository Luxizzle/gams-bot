import test from 'ava';

const CommandCore = require('../../command-core/index');
const Command = require('../../command-core/command');

let msgMock = {
  id: '456',
  author: {
    id: '123',
    mention: '<@123>',
    username: 'user123',
  },
  channel: {},
};

let botMock = {
  user: {
    username: '456',
    mention: '<@456>',
    id: '456',
  },
};

test('Constructs CommandCore', async t => {
  let core = new CommandCore(botMock);

  t.true(core instanceof CommandCore);
});

test('Adds a command', async t => {
  let core = new CommandCore(botMock);

  core.add(new Command('ping'));

  t.is(core.commands.length, 1);
  t.deepEqual(core.commands[0].labels, ['ping']);
});

test('Parses a command', async t => {
  let core = new CommandCore(botMock);

  t.plan(1);

  core
    .add(new Command('test'))
    .arg('arg1', 'string')
    .action((msg, args) => {
      t.deepEqual(args, {
        arg1: {
          match: 'asd',
          name: 'arg1',
          type: 'string',
          value: 'asd',
        },
      });
    });

  // prettier-ignore
  core.parse(Object.assign({
    content: '!str test asd'
  }, msgMock));
});
