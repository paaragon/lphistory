const request = require('request-promise-native');
const config = require('./config/config');

function getConversation(conversationId, timeShift) {
  const conf = config.getConfig();
  const url = `https://lo.msghist.liveperson.net/messaging_history/api/account/${conf.accountId}/conversations/conversation/search`;
  const oauth = {
    consumer_key: conf.consumerKey,
    consumer_secret: conf.consumerSecret,
    token: conf.token,
    token_secret: conf.tokenSecret,
  };

  const body = {
    conversationId
  };

  if (timeShift) {
    const timestamp = Math.trunc(new Date(new Date().getTime() - 1 * timeShift).getTime() / 1000);
    oauth.timestamp = timestamp;
  }

  const options = {
    body,
    json: true,
    oauth: oauth
  };

  return request.post(url, options);
}

module.exports = { getConversation };