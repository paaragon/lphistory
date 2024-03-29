const livepersonService = require('../services/livepersonservice');
const daemonRepo = require('../db/daemonrepo');
const eventPrinter = require('./eventprinter');

async function printLpHistory(conversationId, timeShift, lineLength, env, dVerb) {
  try {
    // get live person conversation
    const json = await livepersonService.getConversation(conversationId, timeShift, env);

    const daemonInfo = await daemonRepo.getDaemonInfo(conversationId, env);

    // retrieve conversation history records
    const conv = json.conversationHistoryRecords[0];

    if (!conv) {
      console.log('\tNO CONVERSATION FOUND'.red);
      return;
    }

    const user = getUserInfo(conv);

    const consumerInfo = eventPrinter.buildConsumerInfo(user, lineLength);
    eventPrinter.print(consumerInfo);

    // retrieve the info we want to print
    const start = conv.info.startTimeL;
    const end = conv.info.endTimeL;
    const msgs = conv.messageRecords;
    const { transfers } = conv;
    const participants = conv.agentParticipants;

    // build the events array
    let events = [];
    events.push({ type: 'start', time: start, data: { timeL: start, conversationId: conv.info.conversationId } });
    if (end !== -1) {
      events.push({ type: 'end', time: end, data: { timeL: end, conversationId: conv.info.conversationId } });
    }
    for (let i = 0; i < msgs.length; i += 1) {
      const msg = msgs[i];
      events.push({ type: 'msg', time: msg.timeL, data: msg });
    }
    for (let i = 0; i < transfers.length; i += 1) {
      const transfer = transfers[i];
      events.push({ type: 'transfer', time: transfer.timeL, data: transfer });
    }
    for (let i = 0; i < participants.length; i += 1) {
      const participant = participants[i];
      events.push({ type: 'participant', time: participant.timeL, data: participant });
    }
    for (let i = 0; i < daemonInfo.length; i += 1) {
      const daemon = daemonInfo[i];
      events.push({ type: 'daemon', time: daemon.task_date, data: daemon });
    }

    // sort the events
    events = events.sort((a, b) => a.time - b.time);

    // print each event
    const div = eventPrinter.buildDivLine(' CONVERSATION INFO ', lineLength, false, true);
    eventPrinter.print(div);
    let prevTime = events[0].time;
    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];
      const msg = eventPrinter.buildPrint(event, prevTime, lineLength, dVerb);
      if (msg) {
        eventPrinter.print(msg);
      }
      prevTime = event.time;
    }
  } catch (e) {
    if (isWrongTimestamp(e)) {
      const correctTShift = getCorrectTShift(e, timeShift);
      console.log(`\n${e}`.red);
      console.log(`WARNING: -t argument is incorrect. You should specify it with value ${correctTShift}`.yellow);
      console.log('If you don\'t specify this argument with the correct value, the Live Person API could stop working.\n'.yellow);
      await printLpHistory(conversationId, correctTShift, lineLength, env);
      console.log(`\nWARNING: -t argument is incorrect. You should specify it with value ${correctTShift}`.yellow);
      console.log('If you don\'t specify this argument with the correct value, the Live Person API could stop working.'.yellow);
    } else {
      console.log('    Unexpected error'.red);
      console.log(`${e}`.red);
      console.log(e.stack);
    }
  }
}

function getUserInfo(data) {
  const consumer = data.consumerParticipants[0];

  const firstName = consumer.firstName === 'undefined' ? null : consumer.firstName;
  const lastName = consumer.lastName === 'undefined' ? null : consumer.lastName;
  let email = consumer.email === 'undefined' ? null : consumer.email;
  let phone = consumer.phone === 'undefined' ? null : consumer.phone;
  const address = null;

  const { sdes } = data;
  const personalInfos = sdes.events.filter((e) => e.sdeType === 'PERSONAL_INFO');
  if (personalInfos) {
    const pInfo = personalInfos[0];
    if (pInfo.personalInfo && pInfo.personalInfo.personalInfo.contacts) {
      const personalContacts = pInfo.personalInfo.personalInfo.contacts
        .filter((c) => c.personalContact);
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
    address,
  };
}

function getCorrectTShift(e, tsShift) {
  const { tsStart, tsEnd } = extractValidTimestamps(e);
  const sentTs = extractCurrentTimestamp(e);
  return suggestTimestampShift(
    parseInt(tsStart, 10),
    parseInt(tsEnd, 10),
    parseInt(sentTs, 10),
    parseInt(tsShift, 10),
  );
}

function suggestTimestampShift(tsStart, tsEnd, sendTs, tsShift) {
  const currTimestamp = tsShift ? sendTs - tsShift : sendTs;
  const midTs = Math.ceil((tsStart + tsEnd) / 2);
  const sugTs = midTs - currTimestamp;
  return sugTs;
}

function isWrongTimestamp(e) {
  return typeof e === 'object'
    && e.statusCode === 401
    && e.response
    && e.response.headers['www-authenticate']
    && e.response.headers['www-authenticate'].indexOf('timestamp_refused');
}

function extractValidTimestamps(error) {
  const wwwauthenticate = error.response.headers['www-authenticate'];
  const regex = /.*oauth_acceptable_timestamps=(.*)-(.*)&+?/gm;
  const m = regex.exec(wwwauthenticate);
  if (m !== null) {
    return {
      tsStart: m[1],
      tsEnd: m[2],
    };
  }
  return {
    tsStart: null,
    tsEnd: null,
  };
}

function extractCurrentTimestamp(error) {
  const auth = error.response.request.headers.Authorization;
  const regex = /.*oauth_timestamp="(.*?)"/gm;
  const m = regex.exec(auth);
  if (m !== null) {
    return m[1];
  }
  return null;
}

module.exports = { printLpHistory };
