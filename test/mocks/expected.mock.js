const moment = require('moment');
const time = moment.utc([2010, 1, 14, 15, 25, 50, 125]).toDate().getTime();
const date = moment(time).format('YYYY MM DD HH:mm:ssZ');

module.exports.expectedStart = `\u001b[90m${date}\u001b[39m =======================\u001b[32m Start xxx-xxx-xxx-xxx \u001b[39m====================>  \u001b[90m[0s]\u001b[39m`;
module.exports.expectedEnd = `\u001b[90m${date}\u001b[39m <========================\u001b[31m End xxx-xxx-xxx-xxx \u001b[39m=====================  \u001b[90m[0s]\u001b[39m`;
module.exports.expectedMsg1 = `\u001b[90m${date}\u001b[39m   \u001b[32m[Consumer]\u001b[39m Hola, quiero comunicarme con un [AGENTE]  --------------\u001b[90m[40y 1m 14d 15h 25m 50s]\u001b[39m`;
module.exports.expectedTransfer1 = `\n\u001b[90m${date}\u001b[39m \u001b[33m> \u001b[39mLD Default == Skill ==>  Whatsapp Bot  ----------------------------\u001b[90m[80y 2m 29d 6h 51m 40s]\u001b[39m`;
module.exports.expectedParticipant1 = `\u001b[90m${date}\u001b[39m \u001b[90m  > LDBot: MANAGER\u001b[39m  -------------------------------------------------\u001b[90m[120y 4m 12d 22h 17m 30s]\u001b[39m`;

