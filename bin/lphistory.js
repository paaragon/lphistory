#!/usr/bin/env node
const argv = require('yargs')
  .usage('Usage: node index.js -c [conversationid]')
  .example('node index.js -c 66408b50-37e1-4142-97b6-4e2f4a973bbf -ts 60000', 'Obtener resumen de la conversación restando 1 minuto al timestamp de OAuth')
  .demandOption(['c'])
  .alias('c', 'conversationid')
  .describe('c', 'Id de conversación a buscar')
  .alias('t', 'timeshift')
  .describe('t', 'Tiempo de desplazamiento para OAuth con Live Person (ms)')
  .argv;

const index = require('../lib/index');

// retrieve cli arguments
const conversationId = argv.c;
const timeShift = argv.t;

(async () => {
  await index.configProcess();
  await index.getLpHistory(conversationId, timeShift);
  process.exit(0);
})();