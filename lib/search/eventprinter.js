
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);
const colors = require('colors');

const participants = {};
let sentByLength = 8;

let duration = 0;

String.prototype.ellipse = String.prototype.ellipse ||
  function (n) {
    return (this.length > n) ? this.substr(0, n - 1) + '...' : this;
  };

function buildConsumerInfo(user, lineLength) {

  let ret = '';
  let msg = ' CONSUMER INFO ';
  const noMsg = ' NO CONSUMER INFO ';

  const div = buildDivLine(msg, lineLength, false, true);
  ret += div;

  if (user.firstName) {
    ret += `    First Name:`.yellow + `${user.firstName}\n`;
  }
  if (user.lastName) {
    ret += `    Last name:`.yellow + `${user.lastName}\n`;
  }
  if (user.email) {
    ret += `    Email:`.yellow + `${user.email}\n`;
  }
  if (user.phone) {
    ret += `    Phone:`.yellow + `${user.phone}\n`;
  }
  if (user.address) {
    ret += `    Address:`.yellow + `${user.address}\n`;
  }
  return ret + '\n';
}

function buildPrint(event, prevTime, length, dVerb) {
  switch (event.type) {
    case 'start':
      return buildStart(event.data, prevTime, length);
    case 'end':
      return printEnd(event.data, prevTime, length);
    case 'msg':
      return printMsg(event.data, prevTime, length);
    case 'transfer':
      return printTransfer(event.data, prevTime, length);
    case 'participant':
      return printParticipant(event.data, prevTime, length);
    case 'daemon':
      return printDaemon(event.data, prevTime, length, dVerb);
    default:
      return JSON.stringify(event.data);
  }
}

function buildStart(data, prevTime, length) {
  let line = ` Start ${data.conversationId} `.green;
  const prevPadLength = Math.ceil((length - line.length) / 2);
  const nextPadLength = length - line.length - prevPadLength;
  for (let i = 0; i < prevPadLength - 1; i++) {
    line = '=' + line;
  }
  for (let i = 0; i < nextPadLength - 3; i++) {
    line = line + '=';
  }
  line += '>';
  return _buildEvent(data.timeL, prevTime, line, length);
}

function printEnd(data, prevTime, length) {
  if (!data.timeL) {
    return;
  }
  let line = ` End ${data.conversationId} `.red;
  const prevPadLength = Math.ceil((length - line.length) / 2);
  const nextPadLength = length - line.length - prevPadLength;
  for (let i = 0; i < prevPadLength - 1; i++) {
    line = '=' + line;
  }
  line = '<' + line;
  for (let i = 0; i < nextPadLength - 3; i++) {
    line = line + '=';
  }
  return _buildEvent(data.timeL, prevTime, line, length);
}

function printMsg(data, prevTime, lineLength) {
  let sentBy = '';
  if (data.sentBy === 'Consumer') {
    sentBy = ('[' + `${data.sentBy}`.padEnd(sentByLength, ' ') + ']').green;
  } else {
    sentBy = ('[' + `${participants[data.participantId]}`.padEnd(sentByLength, ' ') + ']').blue;
    if (sentByLength < participants[data.participantId].length) {
      sentByLength = participants[data.participantId].length;
    }
  }
  const prevLength = '2020 01 21 15:04:10   [Agent   ]'.length;
  const length = lineLength - prevLength;
  let msg = '';
  if (data.messageData.msg) {
    msg = data.messageData.msg.text.ellipse(length).replace(/(?:\r\n|\r|\n)/g, '');
  } else if (data.messageData.file) {
    msg = `[${data.messageData.file.fileType} ADJUNTO] ${data.messageData.file.caption}`;
  } else {
    msg = JSON.stringify(data.messageData);
  }
  return _buildEvent(data.timeL, prevTime, `  ${sentBy} ${msg}`, lineLength);
}

function printTransfer(data, prevTime, lineLength) {
  const by = `${participants[data.by]}`;
  const source = `${data.sourceSkillName}`;
  const reason = `==`.yellow + ` ${data.reason} ` + `==> `.yellow;
  const target = `${data.targetSkillName}`;
  const transferStr = `${source} ${reason} ${target}`;
  return _buildEvent(data.timeL, prevTime, `> [${by}] `.yellow + `${transferStr}`, lineLength, 1);
}

function printParticipant(data, prevTime, lineLength) {
  participants[data.agentId] = data.agentLoginName;
  return _buildEvent(data.timeL, prevTime, `  > ${data.agentLoginName}: ${data.permission}`.grey, lineLength);
}


function printDaemon(data, prevTime, length, dVerb) {
  let dMsg = '';
  if (data.sent_to_close === 'Y') {
    dMsg = `  [Daemon Check]`.magenta + ` sent_to_close ${data.close_err_code}`.gray;
  } else if (data.sent_to_reprocess === 'Y') {
    dMsg = `  [Daemon Check]`.magenta + ` sent_to_reprocess  ${data.reprocess_err_code}`.gray;
  } else if (data.sent_to_transfer === 'Y') {
    dMsg = `  [Daemon Check]`.magenta + ` sent_to_transfer  ${data.transfer_err_code}`.gray;
  } else if (dVerb) {
    dMsg = `  [Daemon Check]`.magenta + ` no action`.gray;
  } else {
    return;
  }
  return _buildEvent(data.task_date, prevTime, dMsg, length);
}

function buildDivLine(msg, lineLength, prevArrow, nextArrow) {
  const half = Math.ceil((lineLength + 7 - msg.length) / 2);
  let prev = '';
  let next = '';
  for (let i = 0; i < half; i++) {
    prev += '=';
  }

  for (let i = 0; i < half; i++) {
    next += '=';
  }

  if (prevArrow) {
    return `<${prev}${msg}${next}\n`;
  } else if (nextArrow) {
    return `${prev}${msg}${next}>\n`;
  } else {
    return `${prev}${msg}${next}=\n`;
  }
}

function _buildEvent(timeL, prevTime, msg, lineLength, prevBl, nextBl) {
  let ret = '';
  duration = duration + (timeL - prevTime);
  const durFormatted = moment.duration(duration, 'milliseconds').format('Y[y] M[m] D[d] H[h] m[m] s[s]');
  const time = new Date(timeL);
  const date = moment(time).format('YYYY MM DD HH:mm:ssZ');
  for (let i = 0; i < prevBl; i++) {
    ret += '\n';
  }
  const line = `${date}`.grey + ` ${msg}  `.padEnd(lineLength, '-') + `[${durFormatted}]`.grey;
  ret += line;
  for (let i = 0; i < nextBl; i++) {
    ret += '\n';
  }
  return ret;
}

function print(msg) {
  console.log(msg);
}

module.exports = {
  print,
  buildPrint,
  buildConsumerInfo,
  buildDivLine
};
