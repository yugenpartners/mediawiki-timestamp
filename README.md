# mwts

create and verify OpenTimestamps for MediaWiki exports

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mwts.svg)](https://npmjs.org/package/mwts)
[![Downloads/week](https://img.shields.io/npm/dw/mwts.svg)](https://npmjs.org/package/mwts)
[![License](https://img.shields.io/npm/l/mwts.svg)](https://github.com/yugenpartners/mwts/blob/master/package.json)

<!-- toc -->

- [mwts](#mwts)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage
<!-- usage -->

```sh-session
$ npm install -g mwts
$ mwts COMMAND
running command...
$ mwts (-v|--version|version)
mwts/1.0.0 darwin-x64 node-v15.2.0
$ mwts --help [COMMAND]
USAGE
  $ mwts COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`mwts help [COMMAND]`](#mwts-help-command)
- [`mwts stamp EXPORT`](#mwts-stamp-export)
- [`mwts verify EXPORT RECEIPTS`](#mwts-verify-export-receipts)

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

## `mwts stamp EXPORT`

timestamp a MediaWiki ".xml" export

```
USAGE
  $ mwts stamp EXPORT

ARGUMENTS
  EXPORT  MediaWiki ".xml" export

OPTIONS
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [src/commands/stamp.ts](https://github.com/yugenpartners/mwts/blob/v1.0.0/src/commands/stamp.ts)_

## `mwts verify EXPORT RECEIPTS`

verify a MediaWiki ".xml" export against a ".ots.json" collection of OpenTimestamps receipts

```
USAGE
  $ mwts verify EXPORT RECEIPTS

ARGUMENTS
  EXPORT    ".xml" export from MediaWiki
  RECEIPTS  ".xml.ots.json" receipt collection from mwts

OPTIONS
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [src/commands/verify.ts](https://github.com/yugenpartners/mwts/blob/v1.0.0/src/commands/verify.ts)_

<!-- commandsstop -->
