
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);
const colors = require('colors');

let duration = 0;

String.prototype.ellipse = String.prototype.ellipse ||
  function (n) {
    return (this.length > n) ? this.substr(0, n - 1) + '...' : this;
  };

function printEvent(event, prevTime, length) {
  switch (event.type) {
    case 'start':
      printStart(event.data, prevTime, length);
      break;
    case 'end':
      printEnd(event.data, prevTime, length);
      break;
    case 'msg':
      printMsg(event.data, prevTime, length);
      break;
    case 'transfer':
      printTransfer(event.data, prevTime, length);
      break;
    case 'participant':
      printParticipant(event.data, prevTime, length);
      break;
    default:
      console.log(event.data);
      break;
  }
}

function printStart(data, prevTime, length) {
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
  _print(data.timeL, prevTime, line, length);
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
  _print(data.timeL, prevTime, line, length);
}

function printMsg(data, prevTime, lineLength) {
  let sentBy = '';
  if (data.sentBy === 'Consumer') {
    sentBy = ('[' + `${data.sentBy}`.padEnd(8, ' ') + ']').green;
  } else {
    sentBy = ('[' + `${data.sentBy}`.padEnd(8, ' ') + ']').blue;
  }
  const prevLength = '2020 01 21 15:04:10   [Agent   ]'.length;
  const length = lineLength - prevLength;
  const msg = data.messageData.msg.text.ellipse(length).replace(/(?:\r\n|\r|\n)/g, '');
  _print(data.timeL, prevTime, `  ${sentBy} ${msg}`, lineLength);
}

function printTransfer(data, prevTime, lineLength) {
  const source = `${data.sourceSkillName}`;
  const reason = `== ${data.reason} ==> `;
  const target = `${data.targetSkillName}`;
  const transferStr = `${source} ${reason} ${target}`;
  _print(data.timeL, prevTime, '> '.yellow + `${transferStr}`, lineLength, 1);
}

function printParticipant(data, prevTime, lineLength) {
  _print(data.timeL, prevTime, `  > ${data.agentLoginName}: ${data.permission}`.grey, lineLength);
}

function _print(timeL, prevTime, msg, lineLength, prevBl, nextBl) {
  duration = duration + (timeL - prevTime);
  const durFormatted = moment.duration(duration, 'milliseconds').format('Y[y] M[m] D[d] H[h] m[m] s[s]');
  const time = new Date(timeL);
  const date = moment(time).format('YYYY MM DD HH:mm:ss');
  for (let i = 0; i < prevBl; i++) {
    console.log();
  }
  const line = `${date}`.grey + ` ${msg}  `.padEnd(lineLength, '-') + `[${durFormatted}]`.grey;
  console.log(line);
  for (let i = 0; i < nextBl; i++) {
    console.log();
  }
}

module.exports = {
  printEvent,
};