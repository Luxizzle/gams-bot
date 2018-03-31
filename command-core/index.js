const EventEmitter = require('events').EventEmitter;
const Command = require('./command');
const MessageTemplateBase = require('./template');
const log = require('debug')('command-core');

class DefaultTemplate extends MessageTemplateBase {
  constructor(result) {
    super();

    this.setState({
      authorMention: msg.author.mention,
      result,
    });
  }

  render(state, actions) {
    return {
      content: `${state.authorMention}, ${state.result}`,
    };
  }
}

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

    this.defaultReply = DefaultTemplate;
  }

  add(cmd) {
    if (cmd instanceof Command === false)
      throw new Error(
        `\`cmd\` should be an instance of Command, got \`${cmd.toString()}\``
      );

    this.commands.push(cmd);

    return cmd;
  }

  parse(msg) {
    let content = msg.content.trim();

    log('[%s] Parsing message by %s', msg.id, msg.author.username);

    // check prefix
    const prefix = this.options.prefixes.find(p => content.startsWith(p));
    if (!prefix) return;

    log('[%s] Got prefix', msg.id);

    // remove prefix from content
    content = content.substr(prefix.length - 1).trim();

    // Find command
    let label;
    let command = this.commands.find(cmd => {
      // Find label
      label = cmd.labels.find(label => content.startsWith(label + ' '));
      return label ? true : false;
    });

    // No command found
    if (!command) return;

    log('[%s] Got command %s', msg.id, label);

    // Remove label from content
    content = content.substr(label.length - 1).trim();

    // Add parsed stuff to message
    msg.command = { command, prefix, label, content };

    this.execute(msg, msg.command);
  }

  async execute(msg, { command, content }) {
    let channel = msg.channel;

    let result = await msg.parse(msg, content);

    if (result) {
      if (result instanceof MessageTemplateBase) {
        result.create(channel.createMessage);
      } else {
        let template = new DefaultTemplate(result);

        template.create(channel.createMessage);
      }
    }
  }
}

module.exports = CommandCore;
