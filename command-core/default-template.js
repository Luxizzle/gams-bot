const MessageTemplateBase = require('./template');

class DefaultTemplate extends MessageTemplateBase {
  constructor(msg, result) {
    super();

    this.setState({
      authorMention: msg.author.mention,
      result,
    });
  }

  render(state) {
    return {
      content: `${state.authorMention}, ${state.result}`,
    };
  }
}

module.exports = DefaultTemplate;
