#!/usr/bin/env node
const yargs = require('yargs');
const index = require('../lib/index');

yargs.scriptName('lphistory')
  .command('search [conversationid]', 'Search conversation', (yargs) => {
    yargs.positional('conversationid', {
      type: 'string',
      describe: 'Conversation id to search'
    }).describe('t', 'Time shift for Live Person OAuth timestamp')
      .alias('t', 'time--shift')
      .describe('l', 'Line length for history. Min: 80')
      .alias('l', 'line-length');
  }, searchConversation)
  .command('clear-config', 'Clear configuration', () => { }, clearConfiguration)
  .example('$0 search [conversationid] -t 60000', 'Search conversation with Live Person OAuth timestamp shift')
  .example('$0 search --help', 'Description of search command')
  .example('$0 clear-config', 'Clears configuration')
  .example('$0 clear-config --help', 'Description of clear-config command')
  .help()
  .argv;

async function searchConversation(argv) {
  const conversationId = argv.conversationid;
  const timeShift = argv.t;
  let lineLength = argv.l || 80;
  lineLength = lineLength < 80 ? 80 : lineLength;
  await index.configProcess();
  console.log('\nSearch conversation\n\n');
  await index.printLpHistory(conversationId, timeShift, lineLength);
  process.exit(0);
}

function clearConfiguration(argv) {
  index.clearConfig();
  console.log('\nConfiguration cleared');
  process.exit(0);
}