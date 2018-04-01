const Logic = {
  // Gates
  OR: (logics, vars) => logics.some(logics => run(logics, vars)),
  AND: (logics, vars) => logics.every(logics => run(logics, vars)),
  XOR: (logics, vars) =>
    logics.filter(logics => run(logics, vars)).length === 1,

  // Variables
  custom: (fn, vars) => fn(vars),
  user_id: (ids, { user }) => array(ids).some(id => user.id === id),
  role_id: (roles, { user }) =>
    user.roles
      ? array(roles).some(id => user.roles.indexOf(id) > 1)
      : false,
  permission_and: (perms, { user, channel }) => {
    let uPerms = channel.permissionOf
      ? channel.permissionOf(user.id)
      : user.permission;

    if (!uPerms) return false;

    return array(perms).every(p => uPerms.has(p));
  },
  permission_or: (perms, { user, channel }) => {
    let uPerms = channel.permissionOf
      ? channel.permissionOf(user.id)
      : user.permission;

    if (!uPerms) return false;

    return array(perms).some(p => uPerms.has(p));
  },
};

// Aliases
Logic.permission = Logic.permission_and;

const array = x => (Array.isArray(x) ? x : [x]);

const run = (logics, vars) => {
  // Root object is always a semi-AND gate
  return Array.from(logics.entries()).every(([key, logics]) =>
    Logic[key](logics, vars)
  );
};

class Permission {
  constructor(perms = { custom: () => true }) {
    // prettier-ignore
    this.perms = {
      OR: [
        { user_id: [process.env.OWNER_ID] }, 
        perms
      ],
    };
  }

  check(msg) {
    let vars = {
      msg: msg,
      user: msg.author,
      channel: msg.channel,
      guild: msg.channel.guild,
    };

    return run(this.perms, vars);
  }
}

module.exports = Permission;
