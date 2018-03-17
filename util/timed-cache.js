const debug = require('debug')('timed-cache')

module.exports = class TimedCache extends Map {
  constructor(options, data) {
    super(data)

    this.options = Object.assign({}, {
      timeout: 5000
    }, options)
  }

  set(key, value, time) {
    time = time === undefined ? this.options.timeout : time
    let timeout

    if (time !== 0) {
      timeout = setTimeout(() => {
        debug('timeout %s', key)
        super.delete(key)
      }, time)
    }

    super.set(key, {
      value,
      timeout
    })

    return value
  }

  update(key, value, force) {
    let map = this.has(key) 
      ? super.set(key, Object.assign({}, super.get(key), { value }))
      : force === true
        ? this.set(key, value)
        : undefined

    return this.get(key)
  }

  get(key) {
    debug(key)
    debug(this.has(key))
    debug(super.get(key))
    return this.has(key) ? super.get(key).value : undefined
  }

  delete(key) {
    if (this.has(key)) {
      let data = super.get(key)
      if (data.timeout) clearTimeout(data.timeout)
      return super.delete(key)
    } else {
      return false
    }
  }
}