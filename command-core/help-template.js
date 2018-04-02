const endent = require('endent');

const MessageTemplateBase = require('./template');

class HelpTemplate extends MessageTemplateBase {
  constructor(msg, { description, commands }) {
    super();

    this.setState({
      description,
      commands,
    });
  }

  render({ description, commands }) {
    return {
      content: endent`
        ${description}

        **Commands**
          ${commands
            .map(
              cmd =>
                `- ${cmd.labels[0]} ${
                  cmd._options.shortDescription
                    ? `- ${cmd._options.shortDescription}`
                    : ''
                }`
            )
            .join('\n')}
        
        Use \`<command> help\` for help on a specific (sub)command.
      `,
    };
  }
}

module.exports = HelpTemplate;
