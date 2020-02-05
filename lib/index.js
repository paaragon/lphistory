const colors = require('colors');
const eventPrinter = require('./eventprinter');
const livepersonService = require('./livepersonservice');
const config = require('./config/config');

async function getLpHistory(conversationId, timeShift) {
  try {

    // get live person conversation
    const json = await livepersonService.getConversation(conversationId, timeShift);

    // retrieve conversation history records
    const conv = json.conversationHistoryRecords[0];

    // retrieve the info we want to print
    const start = conv.info.startTimeL;
    const msgs = conv.messageRecords;
    const transfers = conv.transfers;
    const participants = conv.agentParticipants;

    // build the events array
    let events = [];
    events.push({ type: 'start', time: start, data: { timeL: start, conversationId: conv.info.conversationId } });
    for (const msg of msgs) {
      events.push({ type: 'msg', time: msg.timeL, data: msg });
    }
    for (const transfer of transfers) {
      events.push({ type: 'transfer', time: transfer.timeL, data: transfer });
    }
    for (const participant of participants) {
      events.push({ type: 'participant', time: participant.timeL, data: participant });
    }

    // sort the events
    events = events.sort((a, b) => a.time - b.time);

    // print each event
    let prevTime = events[0].time;
    for (const event of events) {
      eventPrinter.printEvent(event, prevTime);
      prevTime = event.time;
    }
  } catch (e) {
    console.log(`${e}`.red);
  }
};

module.exports = {
  getLpHistory,
  configProcess: config.configProcess,
  createConfig: config.createConfig,
  clearConfig: config.clearConfig,
};