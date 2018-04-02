require('dotenv').config();
require('hard-rejection')();

const log = require('debug')('bot');
const Eris = require('eris');
const glob = require('fast-glob');
const CommandCore = require('./command-core/index');
const Template = require('./command-core/template');
const Command = require('./command-core/command');

global.Template = Template;
global.Command = Command;

const bot = new Eris(process.env.TOKEN);
global.bot = bot;
const core = new CommandCore(bot);
global.core = core;

glob([
  './command-core/default-commands/**/*.cmd.js',
  './commands/**/*.cmd.js',
]).then(files => {
  files.forEach(file => {
    log('Loading command file %s', file);
    require(file);
  });

  log('Loaded all commands');
});

bot.connect();
