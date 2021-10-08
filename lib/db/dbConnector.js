const { Client } = require('pg');

async function connect(host, port, database, user, password) {
  const client = new Client({
    host,
    port: parseInt(port, 10),
    database,
    user,
    password,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  return client;
}

function close(client) {
  client.end();
}

async function query(client, q, params) {
  return client.query(q, params);
}

module.exports = {
  connect,
  close,
  query,
};
