mwts
====

create and verify OpenTimestamps for MediaWiki exports

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mwts.svg)](https://npmjs.org/package/mwts)
[![Downloads/week](https://img.shields.io/npm/dw/mwts.svg)](https://npmjs.org/package/mwts)
[![License](https://img.shields.io/npm/l/mwts.svg)](https://github.com/yugenpartners/mwts/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mwts
$ mwts COMMAND
running command...
$ mwts (-v|--version|version)
mwts/0.0.0 darwin-x64 node-v15.2.0
$ mwts --help [COMMAND]
USAGE
  $ mwts COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mwts hello [FILE]`](#mwts-hello-file)
* [`mwts help [COMMAND]`](#mwts-help-command)

## `mwts hello [FILE]`

describe the command here

```
USAGE
  $ mwts hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ mwts hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/yugenpartners/mwts/blob/v0.0.0/src/commands/hello.ts)_

## `mwts help [COMMAND]`

display help for mwts

```
USAGE
  $ mwts help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
