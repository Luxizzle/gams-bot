import test from 'ava';

const TypeParser = require('../../command-core/type-parser.js');
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

// Role

test('Parses role format', async t => {
  const parser = new TypeParser();

  let result = parser.parse(
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
});

test('Parses role id', async t => {
  const parser = new TypeParser();

  let result = parser.parse(
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
});

test('Parses role name', async t => {
  const parser = new TypeParser();

  let result = parser.parse(
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

// User

test('Parses user format', async t => {
  const parser = new TypeParser();

  let result = parser.parse(
    {
      value: '<@123>',
      name: 'arg',
      type: 'user',
    },
    { msg: msgMock, bot: botMock }
  );

  t.deepEqual(result, {
    value: { name: 'testUser', id: '123' },
    id: '123',
    match: '<@123>',
    name: 'arg',
    type: 'user',
  });
});

test('Parses user id', async t => {
  const parser = new TypeParser();

  let result = parser.parse(
    {
      value: '123',
      name: 'arg',
      type: 'user',
    },
    { msg: msgMock, bot: botMock }
  );

  t.deepEqual(result, {
    value: { name: 'testUser', id: '123' },
    id: '123',
    match: '123',
    name: 'arg',
    type: 'user',
  });
});

test('Parses user name', async t => {
  const parser = new TypeParser();

  let result = parser.parse(
    {
      value: 'testUser',
      name: 'arg',
      type: 'user',
    },
    { msg: msgMock, bot: botMock }
  );

  t.deepEqual(result, {
    value: { name: 'testUser', id: '123' },
    id: '123',
    match: 'testUser',
    name: 'arg',
    type: 'user',
  });
});

test('Creates a correct error', async t => {
  let result = new ParseTypeError({
    data: {},
    name: 'arg',
    value: 'asd',
    type: 'number',
  });

  // its a getter, so just mock it
  result._message = result.message;

  t.deepEqual(JSON.parse(JSON.stringify(result)), {
    error: true,
    name: 'arg',
    value: 'asd',
    type: 'number',
    data: {},
    _message:
      'Expected a value of `number` for `arg` but received `"asd"`',
  });
});
