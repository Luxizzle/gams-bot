import test from 'ava';

const TypeList = require('../../command-core/type-list');
const ParseTypeError = require('../../command-core/type-parser-error');

const botMock = {
  users: [{ username: 'testUser', id: '123' }],
};

const msgMock = {
  channel: {
    guild: {
      roles: [{ name: 'testRole', id: '123' }],
      members: [{ name: 'testUser', id: '123' }],
      channels: [{ username: 'testChannel', id: '123' }],
    },
  },
};

test('Constructs a list', async t => {
  let list = new TypeList();

  t.true(list instanceof TypeList);
});

test('Adds args', async t => {
  let list = new TypeList();

  list.arg('arg', 'type');

  t.is(list.args.length, 1);
  t.deepEqual(list.args[0], {
    name: 'arg',
    types: ['type'],
    optional: false,
  });
});

test('Parses args', async t => {
  let list = new TypeList();

  // prettier-ignore
  list
    .arg('arg1', 'string')
    .arg('arg2', 'number');

  let result = list.parse('str 1.23', { bot: botMock, msg: msgMock });

  t.deepEqual(result, {
    arg1: {
      match: 'str',
      name: 'arg1',
      type: 'string',
      value: 'str',
    },
    arg2: {
      match: '1.23',
      name: 'arg2',
      type: 'number',
      value: 1.23,
    },
  });
});

test('Parses optional args', async t => {
  let list = new TypeList();

  // prettier-ignore
  list
    .arg('arg1', 'number')
    .arg('arg2', 'number', true)
    .arg('arg3', 'user')

  let result = list.parse('1 asd <@123>', { bot: botMock, msg: msgMock });

  t.deepEqual(result, {
    arg1: {
      match: '1',
      name: 'arg1',
      type: 'number',
      value: 1,
    },
    arg3: {
      match: '<@123>',
      name: 'arg3',
      type: 'user',
      id: '123',
      value: { name: 'testUser', id: '123' },
    },
  });

  result = list.parse('1 12 <@123>', { bot: botMock, msg: msgMock });

  t.deepEqual(result, {
    arg1: {
      match: '1',
      name: 'arg1',
      type: 'number',
      value: 1,
    },
    arg2: {
      match: '12',
      name: 'arg2',
      type: 'number',
      value: 12,
    },
    arg3: {
      match: '<@123>',
      name: 'arg3',
      type: 'user',
      id: '123',
      value: { name: 'testUser', id: '123' },
    },
  });
});
