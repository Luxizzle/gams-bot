const log = require('debug')('message-template');
const { DateTime } = require('luxon');
const p = require('../util/p');

let msgContent = {
  content: {
    content: String,
    embed: {
      title: String,
      description: String,
      url: String,
      timestamp: Date,
      color: Number,
      footer: {
        text: String,
        icon_url: String,
      },
      image: {
        url: String,
      },
      thumbnail: {
        url: String,
      },
      video: {
        url: String,
      },
      provider: {
        name: String,
        url: String,
      },
      author: {
        name: String,
        url: String,
        icon_url: String,
        fields: [{ name: String, value: String, inline: Boolean }],
      },
    },
  },
  file: {
    file: String,
    name: String,
  },
};

const defaultActions = {
  now: () =>
    DateTime.local().toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET),
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
      return err;
    }

    this.message = message;

    return this.message;
  }

  setState(newState = {}) {
    Object.assign({}, this.state, newState);

    if (this.message) this._render();
  }

  static toArgs(data) {
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
