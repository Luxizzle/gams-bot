const db = require('./db');

const assert = require('assert');
const is = require('@sindresorhus/is');
const p = require('../util/p');

module.exports = {
  async get(gid, rid) {
    assert(is.string(gid), 'gid should be a string');
    assert(is.string(rid), 'rid should be a string');

    let [err, result] = await p(db.get(`role:${gid}`));

    if (err) {
      if (err.notFound) return;
      throw err;
    }

    return Boolean(result[gid]);
  },
  async put(gid, rid) {
    assert(is.string(gid), 'gid should be a string');
    assert(is.string(rid), 'rid should be a string');

    let [gErr, result] = await p(db.get(`role:${gid}`));

    if (gErr) {
      if (gErr.notFound) {
        result = {};
      } else {
        throw gErr;
      }
    }

    result[rid] = true;

    let [pErr] = await p(db.put(`role:${gid}`, result));
    if (pErr) throw pErr;
  },
  async del(gid, rid) {
    assert(is.string(gid), 'gid should be a string');
    assert(is.string(rid), 'rid should be a string');

    let [gErr, result] = await p(db.get(`role:${gid}`));

    if (gErr) {
      if (gErr.notFound) {
        result = {};
      } else {
        throw gErr;
      }
    }

    delete result[rid];

    let [pErr] = await p(db.put(`role:${gid}`, result));
    if (pErr) throw pErr;
  },
  async toggle(gid, rid) {
    assert(is.string(gid), 'gid should be a string');
    assert(is.string(rid), 'rid should be a string');

    let [gErr, gResult] = await p(this.get(gid, rid));

    if (gErr) throw gErr;

    if (gResult) {
      let [err] = await p(this.del(gid, rid));
      if (err) throw err;

      return false;
    } else {
      let [err] = await p(this.put(gid, rid));
      if (err) throw err;

      return true;
    }
  },
};
