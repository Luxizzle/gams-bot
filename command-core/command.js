const TypeList = require('./type-list');
const ParseTypeError = require('./type-parser-error');
const log = require('debug')('command');

const NO_SUBCOMMAND = Symbol('NO_SUBCOMMAND');

class Command {
  constructor(labels, options = {}) {
    this.labels = Array.isArray(labels) ? labels : [labels];
    this.options = Object.assign({}, options);
    this.subcommands = [];

    this._check = () => true;
    this._action = () => 'No action for this command';

    this.argList = new TypeList();
  }

  add(cmd) {
    if (cmd instanceof Command === false)
      throw new Error(
        `\`cmd\` should be an instance of Command, got \`${cmd.toString()}\``
      );

    this.subcommands.push(cmd);

    return cmd;
  }

  arg(...args) {
    this.argList(...args);

    return this;
  }

  // Requirement check
  check(fn) {
    this._check = fn;
  }

  // Action
  action(fn) {
    if (!fn) return this._action({ bot, msg });

    this._action = fn;
  }

  execute(msg, content) {
    // Check subcommands
    let result = this.parseSubcommands(msg, content);
    if (result !== NO_SUBCOMMAND) return result;

    let args = this.argList.parse(content);
    if (args instanceof ParseTypeError) return args;

    this.action(msg, args);
  }

  parseSubcommands(msg, content) {
    log('[%s] [%s] Parsing message', this.labels[0], msg.id);

    // Find subcommand
    let label;
    let subcommand = this.subcommands.find(cmd => {
      // Find label
      label = cmd.labels.find(label => content.startsWith(label + ' '));
      return label ? true : false;
    });

    if (!subcommand) return NO_SUBCOMMAND;

    log('[%s] [%s] Got subcommand %s', this.labels[0], msg.id, label);

    // Remove label from content
    content = content.substr(label.length - 1).trim();

    // Add parsed stuff to message
    msg.subcommands = (msg.subcommands || []).push({
      subcommand,
      label,
      content,
    });

    // execute command
    return subcommand.execute(msg, msg.subcommands[msg.subcommands.length - 1]);
  }
}

module.exports = Command;
