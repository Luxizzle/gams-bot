const ParseTypeError = require('./type-parser-error');
const TypeParser = require('./type-parser');
const log = require('debug')('type-parser-list');

const argsRegex = /(?:"([^"]+)"|'([^']+)'|(\S+))/g;

/*
list
  .arg('arg1', 'user')
  .arg('arg2, 'channel')
  .arg('arg3', ['user', 'role'])
*/

let idCounter = 1;

class TypeList {
  constructor(parser = new TypeParser()) {
    this.args = [];
    this.parser = parser;

    this.id = idCounter++;

    log('[%s] Constructed type list', this.id);
  }

  arg(name, types = ['string'], optional = false) {
    log(
      '[%s] Pushing arg `%s` of %o, (optional: %s)',
      this.id,
      name,
      types,
      Boolean(optional)
    );

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
        log(
          '[%s] No arguments and first required type is %o',
          this.id,
          first
        );

        return new ParseTypeError({
          value: '',
          name: first.name,
          type: first.types,
        });
      }

      return {};
    }

    let value = contentSplit.shift();
    let args = {};

    // loop trough set arguments
    for (const { name, types, optional } of this.args) {
      let data = null;

      if (
        (value.startsWith(`"`) && value.endsWith(`"`)) ||
        (value.startsWith(`'`) && value.endsWith(`'`))
      ) {
        value = value.slice(1, -1);
      }

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
