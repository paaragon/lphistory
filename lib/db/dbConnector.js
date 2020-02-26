const { Client } = require('pg');

async function connect(host, port, database, user, password) {
  const client = new Client({
    host,
    port: parseInt(port),
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

async function query(client, query, params) {
  return client.query(query, params);
}

module.exports = {
  connect,
  close,
  query,
};
