# Strelizia

A flexible and opinionated bot for Discord.

# Table of Contents

<!-- TOC -->

* [Strelizia](#strelizia)
* [Table of Contents](#table-of-contents)
* [Vision](#vision)
* [Contribution](#contribution)
* [Inner workings](#inner-workings)
  * [Core](#core)
  * [Commands](#commands)
  * [Tasks](#tasks)
  * [Util](#util)
  * [Tests](#tests)

<!-- /TOC -->

# Vision

Strelizia was first built as a small bot with built in Eris components to simply give and take roles from users. It was quickly ridden with bugs and a rewrite was necessary. It is now completely revamped and built from the ground up.

I made the rewrite in mind of easy expanding and customization.

# Contribution

Im open for any suggestions and i've made this bot open for anyone to read and use, but as the descriptions suggests, its opinionated and this is my vision of how i want a bot to work.

If you find any bugs or have suggestions make an issue first so it can be discussed further. Pull requests without any context will most likely be closed.

# Inner workings

## Core

* [`command-core/index.js` ~ `CommandCore`](command-core/index.js)

  Main core of the bot. Contains all logic for command parsing.

* [`command-core/command.js` ~ `Command`](command-core/command.js)

  The base command class, this is where built commands live and its inner logic.

- [`command-core/permission.js` ~ `Permission`](command-core/permission.js)

  Main permission logic lives here and is based on simple logic gates.

- [`command-core/template.js` ~ `MessageTemplateBase`](command-core/template.js)

  A message template rendering interface. Based on how React works. Has an inner state that can be changed and will edit the attached message.

- [`command-core/type-parser.js` ~ `TypeParser`](command-core/type-parser.js)

  An customizable type parser that parses strings to their correct types. If fails, throws ParseTypeError.

- [`command-core/type-parser-error.js` ~ `ParseTypeError`](command-core/type-parser-error.js)

  A simple error that TypeParser throws when the given argument is invalid. Also gives the ability to generate a readable string.

* [`command-core/type-list.js` ~ `TypeList`](command-core/type-list.js)

  A list of types used by Command to create type-based arguments for a command.

* [`command-core/default-template.js` ~ `DefaultTemplate`](command-core/default-template.js)

  The default message template used by CommandCore

## Commands

* [`commands/**/*.cmd.js`](commands/)

  This is where all the commands live.

## Tasks

* [`tasks/**/*.js`](tasks/)

  Often multiple commands share the same logic, this is where that logic lives.

## Util

* [`util/**/*.js`](util/)

  A collection of small functions i use often.

## Tests

* [`test/**/*.test.js`](tests/)

  Where all tests live, all a bit of a work in progress.
