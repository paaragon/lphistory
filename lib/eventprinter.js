
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);
const colors = require('colors');

let duration = 0;

String.prototype.ellipse = String.prototype.ellipse ||
  function (n) {
    return (this.length > n) ? this.substr(0, n - 1) + '...' : this;
  };

function printEvent(event, prevTime) {
  switch (event.type) {
    case 'start':
      printStart(event.data, prevTime);
      break;
    case 'msg':
      printMsg(event.data, prevTime);
      break;
    case 'transfer':
      printTransfer(event.data, prevTime);
      break;
    case 'participant':
      printParticipant(event.data, prevTime);
      break;
    default:
      console.log(event.data);
      break;
  }
}

function printStart(data, prevTime) {
  _print(data.timeL, prevTime, ` === ` + `${data.conversationId}`.red + ` ===>`, 2);
}

function printMsg(data, prevTime) {
  let sentBy = '';
  if (data.sentBy === 'Consumer') {
    sentBy = ('[' + `${data.sentBy}`.padEnd(8, ' ') + ']').green;
  } else {
    sentBy = ('[' + `${data.sentBy}`.padEnd(8, ' ') + ']').blue;
  }
  const msg = data.messageData.msg.text.ellipse(40);
  _print(data.timeL, prevTime, `  ${sentBy} ${msg}`);
}

function printTransfer(data, prevTime) {
  const source = `${data.sourceSkillName}`;
  const reason = `== ${data.reason} ==> `;
  const target = `${data.targetSkillName}`;
  const transferStr = `${source} ${reason} ${target}`;
  _print(data.timeL, prevTime, '> '.yellow + `${transferStr}`, 1);
}

function printParticipant(data, prevTime) {
  _print(data.timeL, prevTime, `  > ${data.agentLoginName}: ${data.permission}`.grey);
}

function _print(timeL, prevTime, msg, prevBl, nextBl) {
  duration = duration + (timeL - prevTime);
  const durFormatted = moment.duration(duration, 'milliseconds').format('YYYY-MM-DD HH:mm:ss');
  const time = new Date(timeL);
  const date = moment(time).format('YYYY MM DD HH:mm:ss');
  for (let i = 0; i < prevBl; i++) {
    console.log();
  }
  const line = `${date}`.grey + ` ${msg}  `.padEnd(70, '-') + ` [${durFormatted}]`.grey;
  console.log(line);
  for (let i = 0; i < nextBl; i++) {
    console.log();
  }
}

module.exports = {
  printEvent,
};