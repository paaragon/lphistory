# Live Person History CLI

## Install

```
npm install -g lphistory
```

## Usage

#### Help

Summary

```
$ lphistory --help

lphistory [command]

Commands:
  lphistory search [conversationid]  Search conversation
  lphistory config [action]          Clear configuration (it is posible to specify the envionment)

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

Examples:
  lphistory search [conversationid] -t      Search conversation with Live Person
  60000                                     OAuth timestamp shift
  lphistory search --help                   Description of search command
  lphistory clear-config                    Clears configuration
  lphistory clear-config --help             Description of clear-config command
```

Search help

```
$ lphistory search --help

lphistory search [conversationid]

Search conversation

Positionals:
  conversationid  Conversation id to search                             [string]

Options:
  --version          Show version number                               [boolean]
  --help             Show help                                         [boolean]
  -t, --time--shift  Time shift for Live Person OAuth timestamp
  -l, --line-length  Line length for history. Min: 80
  -e, --environment  Environment
```

Config help

```
$ lphistory config --help

lphistory config [action]

Clear configuration (it is posible to specify the envionment)

Positionals:
  action                                              [choices: "create", "clear", "list"]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  -e         Environment to config
```

## Search conversation

### Default

```
lphistory search <conversationid>
```

### Specifying environment

If you want to specify an environment, you can pass the `-e` argument. The event name is up to you. If the environment doesn't exists, it will de created.

```
lphistory search <conversationid> -e production
```

### Specifying timestamp shift

If the response gives a 500 error, it is possible that the request timestamp is invalid. This is because OAuth security sends a wrong timestamp to Live Person. It can be fixed specifying a timestamp shift with the argument `-t` followed by the shift in milliseconds.

```
lphistory search <conversationid> -t 60000
```
