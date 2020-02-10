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
      .alias('l', 'line-length')
      .describe('e', 'Environment')
      .alias('e', 'environment');
  }, searchConversation)
  .command('config [action]', 'Clear configuration (it is posible to specify the envionment)', (yargs) => {
    yargs.positional('action', {
      type: String,
      choices: ['create', 'clear', 'list']
    }).describe('e', 'Environment to config');
  }, configTools)
  .example('$0 search [conversationid] -t 60000', 'Search conversation with Live Person OAuth timestamp shift')
  .example('$0 search --help', 'Description of search command')
  .example('$0 clear-config', 'Clears configuration')
  .example('$0 clear-config --help', 'Description of clear-config command')
  .help()
  .argv;

async function searchConversation(argv) {
  const conversationId = argv.conversationid;
  const timeShift = argv.t;
  const env = argv.e || 'default';
  let lineLength = argv.l || 80;
  lineLength = lineLength < 80 ? 80 : lineLength;
  await index.configProcess(env);
  console.log('\nSearch conversation\n');
  await index.printLpHistory(conversationId, timeShift, lineLength, env);
  process.exit(0);
}

async function configTools(argv) {
  const action = argv.action;
  const env = argv.e;
  if (action === 'clear') {
    index.clearConfig(env);
  } else if (action === 'list') {
    index.listConfig(env);
  } else if (action === 'create') {
    await index.createConfig(env);
  }
  process.exit(0);
}