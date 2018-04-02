const EventEmitter = require('events').EventEmitter;
const Command = require('./command');
const MessageTemplateBase = require('./template');
const DefaultTemplate = require('./default-template');
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

    this.commands = [];

    this.defaultReply = DefaultTemplate;

    // its not there in testing
    if (this.bot.on) {
      log('Loading in non-testing enviroment');

      this.bot.on('messageCreate', msg => {
        if (msg.author.bot || msg.author.id === this.bot.user.id)
          return;

        this.parse(msg);
      });
      this.bot.on('ready', () => {
        this.options.prefixes = this.options.prefixes.map(p =>
          p.replace(/@mention/g, this.bot.user.mention)
        );

        log('Loaded as %s', this.bot.user.username);
      });
    }
  }

  add(cmd) {
    if (cmd instanceof Command === false)
      throw new Error(
        `\`cmd\` should be an instance of Command, got \`${cmd.toString()}\``
      );

    cmd.parent = this;
    this.commands.push(cmd);

    return cmd;
  }

  parse(msg) {
    let inGuild = msg.channel.guild ? true : false;

    let content = msg.content.trim();

    log('[%s] Parsing message by %s', msg.id, msg.author.username);

    // check prefix
    const prefix = this.options.prefixes.find(p =>
      content.startsWith(p)
    );
    if (!prefix) return;

    log('[%s] Got prefix', msg.id);

    // remove prefix from content
    content = content.substr(prefix.length).trim() + ' ';

    // Find command
    let label;
    let command = this.commands.find(cmd => {
      log(
        '[%s] Checking label for command %s',
        msg.id,
        cmd.labels[0]
      );

      // No guildOnly commands in dm channels
      if (cmd._options.guildOnly && inGuild === false) return false;

      // Find label
      label = cmd.labels.find(label => {
        return content.startsWith(label + ' ');
      });
      return label ? true : false;
    });

    // No command found
    if (!command) return;

    log('[%s] Got command %s', msg.id, label);

    // Remove label from content
    content = content.substr(label.length).trim();

    // Add parsed stuff to message
    msg.command = { command, prefix, label, content };

    // execute command
    this.execute(msg, msg.command);
  }

  async execute(msg, { command, content }) {
    const failTemplate = new DefaultTemplate(
      msg,
      'Failed to send a message to you. I most likely dont have permissions to send you a DM.'
    );

    let channel;
    try {
      channel = command._options.sendToDM
        ? await msg.author.getDMChannel()
        : msg.channel;
    } catch (err) {
      failTemplate.create(
        msg.channel.createMessage.bind(msg.channel)
      );
      return;
    }

    // Execute command
    let result = await command.execute(msg, content);

    // Output result, if any.
    if (result) {
      if (result instanceof MessageTemplateBase) {
        try {
          await result.create(channel.createMessage.bind(channel));
        } catch (err) {
          failTemplate.create(
            msg.channel.createMessage.bind(msg.channel)
          );
        }
      } else {
        let template = new DefaultTemplate(msg, result.toString());

        try {
          await template.create(channel.createMessage.bind(channel));
        } catch (err) {
          failTemplate.create(
            msg.channel.createMessage.bind(msg.channel)
          );
        }
      }
    }
  }
}

module.exports = CommandCore;
