class ParseTypeError {
  format() {
    const { type, path, value } = this
    const message = `Expected a value of \`${type}\` ${
      path ? `for \`${path}\`` : ''
    } ${value ? `but received \`${JSON.stringify(value)}\`` : ''}`

    return message
  }

  constructor({ data, path, value, type } = {}) {
    this.error = true
    this.path = path
    this.value = value
    this.type = type
  }

  get message() {
    return this.format()
  }
  set message() {}
}

module.exports = ParseTypeError