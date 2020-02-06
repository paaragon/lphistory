const livepersonService = require('../services/livepersonservice');
const eventPrinter = require('./eventprinter');

async function printLpHistory(conversationId, timeShift, lineLength) {
  try {
    // get live person conversation
    const json = await livepersonService.getConversation(conversationId, timeShift);

    // retrieve conversation history records
    const conv = json.conversationHistoryRecords[0];

    const user = getUserInfo(conv);

    const consumerInfo = eventPrinter.buildConsumerInfo(user, lineLength);
    eventPrinter.print(consumerInfo);

    // retrieve the info we want to print
    const start = conv.info.startTimeL;
    const end = conv.info.endTimeL;
    const msgs = conv.messageRecords;
    const transfers = conv.transfers;
    const participants = conv.agentParticipants;

    // build the events array
    let events = [];
    events.push({ type: 'start', time: start, data: { timeL: start, conversationId: conv.info.conversationId } });
    if (end !== -1) {
      events.push({ type: 'end', time: end, data: { timeL: end, conversationId: conv.info.conversationId } });
    }
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
    const div = eventPrinter.buildDivLine(' CONVERSATION INFO ', lineLength, false, true);
    eventPrinter.print(div);
    let prevTime = events[0].time;
    for (const event of events) {
      const msg = eventPrinter.buildPrint(event, prevTime, lineLength);
      eventPrinter.print(msg);
      prevTime = event.time;
    }
  } catch (e) {
    console.log(e);
    console.log(`${e}`.red);
  }
}

function getUserInfo(data) {
  const consumer = data.consumerParticipants[0];

  const firstName = consumer.firstName === 'undefined' ? null : consumer.firstName;
  const lastName = consumer.lastName === 'undefined' ? null : consumer.lastName;
  let email = consumer.email === 'undefined' ? null : consumer.email;
  let phone = consumer.phone === 'undefined' ? null : consumer.phone;
  let address = null;

  const sdes = data.sdes;
  const personalInfos = sdes.events.filter(e => e.sdeType === 'PERSONAL_INFO');
  if (personalInfos) {
    const pInfo = personalInfos[0];
    if (pInfo.personalInfo && pInfo.personalInfo.personalInfo.contacts) {
      personalContacts = pInfo.personalInfo.personalInfo.contacts.filter(c => c.personalContact);
      if (personalContacts) {
        const pC = personalContacts[0];
        const personalContactPhone = pC.personalContact.phone;
        if (personalContactPhone && !phone) {
          phone = personalContactPhone;
        }
        const personalContactEmail = pC.personalContact.email;
        if (personalContactEmail && !email) {
          email = personalContactEmail;
        }
        const personalContactAddress = pC.personalContact.address;
        if (personalContactAddress && !address) {
          email = personalContactAddress;
        }
      }
    }
  }

  return {
    firstName,
    lastName,
    email,
    phone,
    address
  }
}

module.exports = { printLpHistory };