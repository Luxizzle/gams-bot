let ParseTypeError = require('./type-parser-error');
let TypeParser = require('./type-parser');

let argsRegex = /(?:"([^"]+)"|'([^']+)'|```((\S|\s)+)```|(\S+))/g;

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

  arg(name, types = ['string'], optional = false) {
    this.args.push({
      name,
      types: Array.isArray(types) ? types : [types],
      optional,
    });

    return this;
  }

  parse(content, { bot, msg }) {
    let contentSplit = content.match(argsRegex);

    // No argument handling
    if (!contentSplit) {
      if (this.args.length === 0) return {};

      // Get first required
      let first = this.args.find(arg => !arg.optional);
      if (first) {
        return new ParseTypeError({
          value: '',
          name: first.name,
          type: first.type,
        });
      }

      return {};
    }

    let value = contentSplit.shift();
    let args = {};

    // loop trough set arguments
    for (const { name, types, optional } of this.args) {
      let data = null;

      // loop trough types
      for (const type of types) {
        // parse type
        data = this.parser.parse({ value, name, type }, { bot, msg });

        // if its not an error, we've found the argument
        if (data instanceof ParseTypeError === false) break;
      }

      // if end result is an error
      if (data instanceof ParseTypeError) {
        // not optional, return error
        if (!optional) return data;
      } else {
        // got the argument, add to args object
        args[name] = data;
      }

      // get next argument
      value = contentSplit.shift();
    }

    return args;
  }
}

module.exports = TypeList;
