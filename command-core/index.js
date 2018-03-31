const EventEmitter = require('events').EventEmitter;
const Command = require('./command');
const log = require('debug')('command-core');

class CommandCore extends EventEmitter {
  constructor(bot, options) {
    super();

    this.bot = bot;

    this.options = Object.assign(
      {
        prefixes: ['@mention ', '!str '],
      },
      options
    );

    this.options.prefixes = Array.isArray(this.options.prefixes)
      ? this.options.prefixes
      : [this.options.prefixes];

    this.options.prefixes = this.options.prefixes.map(p =>
      p.replace(/@mention/g, this.bot.user.mention)
    );

    this.commands = [];
  }

  add(cmd) {
    this.commands.push(cmd);

    return cmd;
  }

  parse(msg) {
    let content = msg.content.trim();

    log('[%s] Parsing message by %s', msg.id, msg.author.username);

    // check prefix
    const prefix = this.options.prefixes.find(p => content.startsWith(p));
    if (!prefix) return;

    log('[%s] Got prefix');

    // remove prefix from content
    content = content.substr(prefix.length - 1).trim();
  }
}

module.exports = CommandCore;
