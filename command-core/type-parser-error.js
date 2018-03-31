class ParseTypeError extends TypeError {
  constructor({ data, name, value, type } = {}) {
    super();

    this.error = true;
    this.name = name;
    this.value = value;
    this.type = type;
    this.data = data;
  }

  get message() {
    const { type, name, value } = this;
    const message = `Expected a value of \`${type}\` ${
      name ? `for \`${name}\`` : ''
    } ${value ? `but received \`${JSON.stringify(value)}\`` : ''}`;

    return message;
  }
  set message(v) {}
}

module.exports = ParseTypeError;
