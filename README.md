# Live Person History CLI

## Usage
```
lphistory [command]

Commands:
  lphistory search [conversationid]  Search for conversation
  lphistory clear-config             Clear configuration

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

Examples:
  lphistory search [conversationid] -t 60000  Search for conversation with Live Person OAuth timestamp shift
  lphistory search --help                     Description of search command
  lphistory clear-config                      Clears configuration
  lphistory clear-config --help               Description of clear-config command
```