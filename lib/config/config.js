const question = require('./question');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

function configExists() {
  try {
    fs.accessSync(configPath, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

async function configProcess() {
  const exists = configExists();
  if (!exists) {
    console.log(`\nLive Person configuration not found. Let's initialize it!`);
    await createConfig();
  }
}

async function createConfig() {
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

  fs.writeFileSync(configPath, JSON.stringify(config));
}

function getConfig() {
  const content = fs.readFileSync(configPath);
  return JSON.parse(content);
}

function clearConfig() {
  const exists = configExists();
  if (exists) {
    fs.unlinkSync(configPath);
  }
}

module.exports = {
  configProcess,
  createConfig,
  getConfig,
  clearConfig
}