const ParseTypeError = require('./type-parser-error');

const roleRegex = /<@&([0-9]+)>/;
const userRegex = /<@!?([0-9]+)>/;
const channelRegex = /<#([0-9]+)>/;

const defaultParsers = {
  null: v => true,
  // string
  string: v => true,
  // number
  number: v => (Number(v) ? true : false),
  int: v => (parseInt(v) ? true : false),
  float: v => (parseFloat(v) ? true : false),
  // discord
  role: (v, { msg }) => {
    const roles =
      msg.channel && msg.channel.guild ? msg.guild.roles : null;

    return (
      roleRegex.test(v) ||
      (roles
        ? Boolean(roles.find(r => r.name === v || r.id === v))
        : false)
    );
  },
  user: (v, { bot, msg }) => {
    const members = msg.guild ? msg.guild.members : null;
    const users = bot.users;

    return (
      userRegex.test(v) ||
      (members
        ? Boolean(members.find(u => u.username === v || u.id === v))
        : false) ||
      (users
        ? Boolean(users.find(u => u.username === v || u.id === v))
        : false)
    );
  },
  channel: (v, { msg }) => {
    const channels =
      msg.channel && msg.channel.guild
        ? msg.channel.guild.channels
        : null;

    return (
      channelRegex.test(v) ||
      (channels
        ? Boolean(channels.find(c => c.name === v || c.id === v))
        : false)
    );
  },
};

const defualtConverters = {
  // string
  string: v => ({ value: v }),
  // number
  number: v => ({ value: Number(v) }),
  int: v => ({ value: parseInt(v, 16) }),
  float: v => ({ value: parseFloat(v, 16) }),
  // discord
  role: v => ({
    id: (m = roleRegex.match(v) ? m[1] : null),
  }),
  user: v => ({ id: (m = userRegex.match(v) ? m[1] : null) }),
  channel: v => ({ id: (m = channelRegex.match(v) ? m[1] : null) }),
};

const defaultProcessors = {
  // discord
  role: (role, { msg }) => {
    const roles =
      msg.channel && msg.channel.guild ? msg.guild.roles : null;

    if (roles) {
      role.value = roles.find(
        r => r.id === role.id || r.name === role.match
      );
    }

    if (role.value) role.id = role.value.id;
  },
  user: (user, { msg }) => {
    const members = msg.guild ? msg.guild.members : null;
    const users = bot.users;

    if (members) {
      user.value = members.find(
        u => u.id === user.id || u.name === user.match
      );
    } else if (users) {
      user.value = users.find(
        u => u.id === user.id || u.name === user.match
      );
    }

    if (user.value) user.id = user.value.id;
  },
  channel: (channel, { msg }) => {
    const channels =
      msg.channel && msg.channel.guild
        ? msg.channel.guild.channels
        : null;

    if (channels) {
      channel.value = channels.find(
        c => c.id === channel.id || c.name === channel.match
      );
    }

    if (channel.value) channel.id = channel.value.id;
  },
};

class TypeParser {
  constructor({
    parsers = {},
    converters = {},
    processors = {},
  } = {}) {
    this.parsers = Object.assign({}, defaultParsers, parsers);
    this.converters = Object.assign(
      {},
      defualtConverters,
      converters
    );
    this.processors = Object.assign(
      {},
      defaultProcessors,
      processors
    );
  }

  parse({ value, name, type }, { bot, msg }) {
    if (!this.parsers[type])
      throw new Error(`No parser found for type \`${type}\``);

    if (!this.parsers[type](raw, { bot, msg }))
      return new ParseTypeError({ value, name, type });

    let data = {
      match: value,
      name,
      type,
    };

    if (this.converters[type])
      Object.assign(data, this.converters[type](value, { bot, msg }));

    if (this.processors[type])
      this.processors[type](data, { bot, msg });
  }
}

module.exports = TypeParser;
