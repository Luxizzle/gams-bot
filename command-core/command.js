const TypeList = require('./type-list');

class Command {
  constructor(labels, options = {}) {
    this.labels = Array.isArray(labels) ? labels : [labels];
    this.options = Object.assign({}, options);
    this.subcommands = [];
    this._action = () => 'No action for this command';

    this.argList = new TypeList();
  }

  arg(...args) {
    this.argList(...args);

    return this;
  }

  action(fn) {
    this._action = fn;
  }

  parse(msg, content) {}
}

module.exports = Command;
