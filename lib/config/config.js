const question = require('./question');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config');

function getConfigPath(env) {
  e = env ? env : 'default';
  return `${configPath}.${e}.json`
}

function configExists(env) {
  try {
    const cPath = getConfigPath(env);
    fs.accessSync(cPath, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

async function configProcess(env) {
  const exists = configExists(env);
  if (!exists) {
    console.log(`\nLive Person configuration not found for environment ${env}. Let's initialize it!`);
    await createConfig(env);
  }
}

async function createConfig(env) {
  console.log('Live Person API Credentials:');
  const accountId = await question.question('Enter your LP account Id: ');
  const consumerKey = await question.question('Enter your LP API Consumer Key: ');
  const consumerSecret = await question.question('Enter your LP API Consumer Secret: ');
  const token = await question.question('Enter your LP API token: ');
  const tokenSecret = await question.question('Enter your LP API Token Secret: ');
  question.closeStream();

  const config = {
    accountId: accountId.trim(),
    consumerKey: consumerKey.trim(),
    consumerSecret: consumerSecret.trim(),
    token: token.trim(),
    tokenSecret: tokenSecret.trim()
  }

  const cPath = getConfigPath(env);
  fs.writeFileSync(cPath, JSON.stringify(config));
}

function getConfig(env) {
  const cPath = getConfigPath(env);
  const content = fs.readFileSync(cPath);
  return JSON.parse(content);
}

function clearConfig(env) {
  const exists = configExists(env);
  const cPath = getConfigPath(env);
  if (exists) {
    fs.unlinkSync(cPath);
  }
}

function listConfig(env) {

}

module.exports = {
  configProcess,
  createConfig,
  getConfig,
  clearConfig,
  listConfig
}