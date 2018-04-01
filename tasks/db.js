const Level = require('level');

const db = Level('./db', {
  valueEncoding: 'json',
});

module.exports = db;
