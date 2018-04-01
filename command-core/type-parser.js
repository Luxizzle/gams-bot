const ParseTypeError = require('./type-parser-error');
const log = require('debug')('type-parser');

const roleRegex = /<@&([0-9]+)>/;
const userRegex = /<@!?([0-9]+)>/;
const channelRegex = /<#([0-9]+)>/;

const defaultParsers = {
  null: () => true,
  // string
  string: () => true,
  // number
  number: v => (Number(v) ? true : false),
  int: v => (parseInt(v) ? true : false),
  float: v => (parseFloat(v) ? true : false),
  // discord
  role: (v, { msg }) => {
    const roles =
      msg.channel && msg.channel.guild
        ? msg.channel.guild.roles
        : null;

    return (
      roleRegex.test(v) ||
      (roles
        ? Boolean(roles.find(r => r.name === v || r.id === v))
        : false)
    );
  },
  user: (v, { bot, msg }) => {
    const members =
      msg.channel && msg.channel.guild
        ? msg.channel.guild.members
        : null;
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
    id: roleRegex.test(v) ? roleRegex.exec(v)[1] : null,
  }),
  user: v => ({
    id: userRegex.test(v) ? userRegex.exec(v)[1] : null,
  }),
  channel: v => ({
    id: channelRegex.test(v) ? channelRegex.exec(v)[1] : null,
  }),
};

const defaultProcessors = {
  // discord
  role: (role, { msg }) => {
    const roles =
      msg.channel && msg.channel.guild
        ? msg.channel.guild.roles
        : null;

    if (Number(role.match) && !role.id) role.id = role.match;

    if (roles) {
      role.value = roles.find(
        r => r.id === role.id || r.name === role.match
      );
    }

    if (role.value) {
      role.id = role.value.id;
    } else {
      return true; // error
    }
  },
  user: (user, { msg, bot }) => {
    const members =
      msg.channel && msg.channel.guild
        ? msg.channel.guild.members
        : null;
    const users = bot.users;

    if (Number(user.match) && !user.id) user.id = user.match;

    if (members) {
      user.value = members.find(
        u => u.id === user.id || u.name === user.match
      );
    } else if (users) {
      user.value = users.find(
        u => u.id === user.id || u.name === user.match
      );
    }

    if (user.value) {
      user.id = user.value.id;
    } else {
      return true; // error
    }
  },
  channel: (channel, { msg }) => {
    const channels =
      msg.channel && msg.channel.guild
        ? msg.channel.guild.channels
        : null;

    if (Number(channel.match) && !channel.id)
      channel.id = channel.match;

    if (channels) {
      channel.value = channels.find(
        c => c.id === channel.id || c.name === channel.match
      );
    }

    if (channel.value) {
      channel.id = channel.value.id;
    } else {
      return true; // error
    }
  },
};

/**
 * Parsers: Simple check if a string is of a type.
 * Converters: Converts a simple string to a type.
 * Processors: Does a more complicated process on
 *   a type, can return an error.
 */
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

  parse({ value, name, type }, { bot, msg } = {}) {
    if (!this.parsers[type])
      throw new Error(`No parser found for type \`${type}\``);

    let data = {
      match: value,
      name,
      type,
    };

    log('Parsing type %s (%o)', type, data);

    if (!this.parsers[type](value, { bot, msg }))
      return new ParseTypeError({
        value,
        name,
        type,
        data,
      });

    log('Parsed type %s (%o)', type, data);

    if (this.converters[type])
      Object.assign(data, this.converters[type](value, { bot, msg }));

    log('Converted type %s (%o)', type, data);

    let error;
    if (this.processors[type])
      error = this.processors[type](data, { bot, msg });

    if (error) {
      return new ParseTypeError({
        value,
        name,
        type,
        data,
      });
    }

    log('Processed type %s (%o)', type, data);

    return data;
  }
}

module.exports = TypeParser;
