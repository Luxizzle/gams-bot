const log = require('debug')('template');
const { DateTime } = require('luxon');
const p = require('../util/p');

const defaultActions = {
  now: () =>
    DateTime.local().toLocaleString(
      DateTime.TIME_24_WITH_SHORT_OFFSET
    ),
};

class MessageTemplateBase {
  constructor(actions = {}) {
    this.state = {};
    this.actions = Object.assign({}, defaultActions, actions);
  }

  async create(createMessage) {
    if (this.message) throw new Error('Template is already active');

    let args = this._render();

    let [err, message] = await p(createMessage(...args));
    if (err) {
      log('[error] Error while creating message - %o', err);
      throw err;
    }

    this.message = message;

    return this.message;
  }

  setState(patch = {}) {
    Object.assign(this.state, patch);

    if (this.message) this._render();
  }

  static toArgs(data) {
    log('toArgs - %O', data);

    return [data.content, data.file];
  }

  _render() {
    let data = this.render(this.state, this.actions);

    let args = MessageTemplateBase.toArgs(data);

    if (this.message) {
      this.message.edit(...args);
    } else {
      return args;
    }
  }

  forceRender() {
    this._render();
  }

  render() {}
}

module.exports = MessageTemplateBase;
