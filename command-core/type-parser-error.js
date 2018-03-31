class ParseTypeError extends TypeError {
  constructor({ data, path, value, types } = {}) {
    super();

    this.error = true;
    this.path = path;
    this.value = value;
    this.types = types;
    this.data = data;
  }

  get message() {
    const { types, path, value } = this;
    const message = `Expected a value of \`${types.join(', ')}\` ${
      path ? `for \`${path}\`` : ''
    } ${value ? `but received \`${JSON.stringify(value)}\`` : ''}`;

    return message;
  }
  set message(v) {}
}

module.exports = ParseTypeError;
