# Live Person History CLI

## Usage
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

```
$ lphistory config --help

lphistory config [action]

Clear configuration (it is posible to specify the envionment)

Positionals:
  action                                              [choices: "clear", "list"]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  -e         Environment to config
```