const debug = require('../debug.cmd');
const endent = require('endent');
const yaml = require('js-yaml');

const take = (obj, keys) => {
  let res = {};
  keys.forEach(key => (res[key] = obj[key]));
  return res;
};

debug
  .add(new Command(['role-list', 'roles', 'rl']))
  .options({
    shortDescription: 'List roles',
    guildOnly: true,
  })
  .permission({ custom: () => false })
  .action(async msg => {
    const rolesArr = (msg.channel.guild.roles || [])
      .map(r => r)
      .sort((a, b) => b.position - a.position)
      .map(r => [
        r.name,
        take(r, ['id', 'managed', 'hoist', 'mentionable']),
      ]);

    let roles = {};
    rolesArr.forEach(([name, props]) => (roles[name] = props));

    if (roles.length === 0) return 'This guild has no roles.';

    let rolesYaml;
    try {
      rolesYaml = yaml.safeDump(roles);
    } catch (err) {
      return err;
    }

    // prettier-ignore
    return endent`
      **Roles:**
      \`\`\`yaml
      ${rolesYaml}
      \`\`\`
    `
  });
