let ParseTypeError = require('./type-parser-error');
let TypeParser = require('./type-parser');

let argsRegex = /(?:"([^"]+)"|'([^']+)'|(\S+))/g;

/*
list
  .arg('arg1', 'user')
  .arg('arg2, 'channel')
  .arg('arg3', ['user', 'role'])
*/

class TypeList {
  constructor(parser = new TypeParser()) {
    this.args = [];
    this.parser = parser;
  }

  arg(name, type = 'string', optional = false) {
    this.args.push({
      name,
      type: Array.isArray(type) ? type : [type],
      optional,
    });

    return this;
  }

  parse(content, { msg, bot }) {
    let contentArgs = content.match(argsRegex);

    let value = contentArgs.shift();

    let args = {};

    for (const [
      index,
      { name, type, optional },
    ] of this.args.entries()) {
      let result = this.parser.parse(
        { value, name, type },
        { msg, bot }
      );

      if (result instanceof ParseTypeError) {
        // Not the right type
        if (optional) {
          continue; // optional, skip this arg
        }
        return result; // return error
      }

      args[name] = result;
      value = contentArgs.shift();
    }

    return args;
  }
}
