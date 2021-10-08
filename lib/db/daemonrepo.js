const moment = require('moment');
const db = require('./dbConnector');
const config = require('../config/config');

async function getDaemonInfo(conversationId, env) {
  const conf = config.getConfig(env);
  const client = await db.connect(
    conf.pg.host,
    conf.pg.port,
    conf.pg.database,
    conf.pg.user,
    conf.pg.password,
  );
  const results = await client.query('select * from tdaemonwsp_tasklog where conversation_id = $1', [conversationId]);
  const daemonInfo = results.rows.map((r) => ({
    ...r,
    task_date: moment(r.task_date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate().getTime(),
    sent_date: moment(r.sent_date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate().getTime(),
  }));
  db.close(client);
  return daemonInfo;
}

module.exports = {
  getDaemonInfo,
};
