import test from 'ava';

const TypeParser = require('../../command-core/type-parser.js');

const botMock = {
  users: [{ name: 'testUser', id: '123' }],
};

const msgMock = {
  channel: {
    guild: {
      roles: [{ name: 'testRole', id: '123' }],
      members: [{ name: 'testUser', id: '123' }],
      channels: [{ name: 'testChannel', id: '123' }],
    },
  },
};

test('Constructs a parser', async t => {
  const parser = new TypeParser();

  t.true(parser instanceof TypeParser);
});

test('Parses string', async t => {
  const parser = new TypeParser();

  const result = parser.parse(
    {
      value: 'asd',
      name: 'arg',
      type: 'string',
    },
    { bot: botMock, msg: msgMock }
  );

  t.deepEqual(result, {
    match: 'asd',
    name: 'arg',
    type: 'string',
    value: 'asd',
  });
});

test('Parses number', async t => {
  const parser = new TypeParser();

  let result;

  result = parser.parse(
    {
      value: '1',
      name: 'arg',
      type: 'number',
    },
    { bot: botMock, msg: msgMock }
  );

  t.deepEqual(result, {
    match: '1',
    name: 'arg',
    type: 'number',
    value: 1,
  });

  result = parser.parse(
    {
      value: '1',
      name: 'arg',
      type: 'int',
    },
    { bot: botMock, msg: msgMock }
  );

  t.deepEqual(result, {
    match: '1',
    name: 'arg',
    type: 'int',
    value: 1,
  });

  result = parser.parse(
    {
      value: '1.1',
      name: 'arg',
      type: 'float',
    },
    { bot: botMock, msg: msgMock }
  );

  t.deepEqual(result, {
    match: '1.1',
    name: 'arg',
    type: 'float',
    value: 1.1,
  });
});

test('Parses role', async t => {
  const parser = new TypeParser();

  let result;

  result = parser.parse(
    {
      value: '<@&123>',
      name: 'arg',
      type: 'role',
    },
    { msg: msgMock, bot: botMock }
  );

  t.deepEqual(result, {
    value: { name: 'testRole', id: '123' },
    id: '123',
    match: '<@&123>',
    name: 'arg',
    type: 'role',
  });

  result = parser.parse(
    {
      value: '123',
      name: 'arg',
      type: 'role',
    },
    { msg: msgMock, bot: botMock }
  );

  t.deepEqual(result, {
    value: { name: 'testRole', id: '123' },
    id: '123',
    match: '123',
    name: 'arg',
    type: 'role',
  });

  result = parser.parse(
    {
      value: 'testRole',
      name: 'arg',
      type: 'role',
    },
    { msg: msgMock, bot: botMock }
  );

  t.deepEqual(result, {
    value: { name: 'testRole', id: '123' },
    id: '123',
    match: 'testRole',
    name: 'arg',
    type: 'role',
  });
});
