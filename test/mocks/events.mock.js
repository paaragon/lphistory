const moment = require('moment');
const time = moment.utc([2010, 1, 14, 15, 25, 50, 125]).toDate().getTime();
const date = moment(time).format('YYYY MM DD HH:mm:ssZ');

module.exports.msg1 = {
  "type": "TEXT_PLAIN",
  "messageData": {
    "msg": {
      "text": "Hola, quiero comunicarme con un [AGENTE]"
    }
  },
  "messageId": "ms::dialog:8f52b797-7c45-459f-8f17-5ce11491a020::msg:0",
  "seq": 0,
  "dialogId": "8f52b797-7c45-459f-8f17-5ce11491a020",
  "participantId": "ac4a51efea85d91c83de6873a94cbd59c683f74e65745a931854aacc97bf3271",
  "time": "2020-02-05 08:28:12.571+0000",
  "timeL": time,
  "sentBy": "Consumer",
  "contextData": {
    "rawMetadata": "[]",
    "structuredMetadata": []
  }
};

module.exports.transfer1 = {
  "timeL": time,
  "time": "2020-02-05 08:28:12.625+0000",
  "assignedAgentId": "null",
  "targetSkillId": 1328139750,
  "targetSkillName": "Whatsapp Bot",
  "reason": "Skill",
  "by": "1336100450",
  "sourceSkillId": 1336104450,
  "sourceSkillName": "LD Default",
  "sourceAgentId": "0",
  "sourceAgentFullName": "NA",
  "sourceAgentLoginName": "NA",
  "sourceAgentNickname": "NA",
  "dialogId": "8f52b797-7c45-459f-8f17-5ce11491a020"
};

module.exports.participant1 = {
  "agentFullName": "LDBot",
  "agentNickname": "LDBot",
  "agentLoginName": "LDBot",
  "agentDeleted": false,
  "agentId": "1336100450",
  "agentPid": "42f8737b-a2f1-5771-ac78-aab5aa20ced0",
  "userType": "2",
  "userTypeName": "Bot",
  "role": "AGENTMANAGER",
  "agentGroupName": "Main Group",
  "agentGroupId": -1,
  "time": "2020-02-05 08:28:12.561+0000",
  "timeL": time,
  "permission": "MANAGER",
  "dialogId": "8f52b797-7c45-459f-8f17-5ce11491a020"
};