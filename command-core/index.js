const EventEmitter = require('events').EventEmitter

class CommandCore extends EventEmitter {
  constructor() {
    super()

    this.commands = {}
  }

  add(cmd, options)

  parse(msg) {

  }
}

module.exports = CommandCore
