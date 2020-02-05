#!/usr/bin/env node
const yargs = require('yargs');
const index = require('../lib/index');

yargs.scriptName('lphistory')
  .command('search [conversationid]', 'Search for conversation', (yargs) => {
    yargs.positional('conversationid', {
      type: 'string',
      describe: 'Conversation id for search'
    }).describe('t', 'Time shift for Live Person OAuth timestamp')
      .alias('t', 'time--shift');
  }, searchConversation)
  .command('clear-config', 'Clear configuration', () => { }, clearConfiguration)
  .example('$0 search [conversationid] -t 60000', 'Search for conversation with Live Person OAuth timestamp shift')
  .example('$0 search --help', 'Description of search command')
  .example('$0 clear-config', 'Clears configuration')
  .example('$0 clear-config --help', 'Description of clear-config command')
  .help()
  .argv;

async function searchConversation(argv) {
  const conversationId = argv.c;
  const timeShift = argv.t;
  await index.configProcess();
  await index.getLpHistory(conversationId, timeShift);
  process.exit(0);
}

function clearConfiguration(argv) {
  index.clearConfig();
  console.log('Configuration cleared');
  process.exit(0);
}