const question = require('./question');
const fs = require('fs');
const path = require('path');

const CONFIG_FOLDER = path.join(__dirname, 'files');

function getExistentEnvs(env) {
  const fileRegex = env ? new RegExp(`config\.(${env})\.json`) : new RegExp(`config\.(.*)\.json`);
  const dir = fs.readdirSync(CONFIG_FOLDER);
  const envs = [];
  for (const file of dir) {
    const extracted = fileRegex.exec(file);
    if (extracted) {
      envs.push(extracted[1]);
    }
  }

  return envs;
}

function getConfigPath(env) {
  e = env ? env : 'default';
  return path.join(CONFIG_FOLDER, `config.${e}.json`);
}

function configExists(env) {
  const cPath = getConfigPath(env);
  return fs.existsSync(cPath);
}

async function configProcess(env) {
  const exists = configExists(env);
  if (!exists) {
    console.log(`\nLive Person configuration not found for environment`, `${env}`.green, `.Let's initialize it!`);
    await createConfig(env);
  } else {
    console.log(`\nSearching conversation with ` + `${env}`.green + ` credentials`);
  }
}

async function createConfig(env) {
  const e = env ? env : 'default';
  console.log(`\nLive Person API Credentials for environment`, `${e}`.green, '\n');
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

  console.log(config);
  const cPath = getConfigPath(env);
  console.log(cPath);
  fs.writeFileSync(cPath, JSON.stringify(config));
}

function getConfig(env) {
  try {
    const cPath = getConfigPath(env);
    const content = fs.readFileSync(cPath);
    return JSON.parse(content.toString());
  } catch (e) {
    return null;
  }
}

function clearConfig(env) {
  const envs = getExistentEnvs(env);
  for (const environment of envs) {
    const cPath = getConfigPath(environment);
    fs.unlinkSync(cPath);
  }

  console.log('\n    Configuration cleared');
}

function listConfig(env) {
  const envs = getExistentEnvs(env);
  if (envs.length === 0 && env) {
    console.log(`\n    NO CONFIGURATION FOUND FOR ENVIRONMENT`.red, `${env}`.green);
    return;
  } else if (envs.length === 0 && !env) {
    console.log(`\n    NO CONFIGURATION FOUND`.red);
    return;
  }
  
  for (const environment of envs) {
    printConfig(environment);
  }
}
function printConfig(env) {
  const config = getConfig(env);
  console.log(`\n  ENVIRONMENT:`, `${env}`.green);
  console.log(`    Account id:     `, `${config.accountId}`.yellow);
  console.log(`    Consumer key:   `, `${config.consumerKey}`.yellow);
  console.log(`    Consumer secret:`, `${config.consumerSecret}`.yellow);
  console.log(`    Token:          `, `${config.token}`.yellow);
  console.log(`    Token secret:   `, `${config.tokenSecret}`.yellow);
}

module.exports = {
  configProcess,
  createConfig,
  getConfig,
  clearConfig,
  listConfig,
  _getExistentEnvs: getExistentEnvs,
  _getConfigPath: getConfigPath,
  _configExists: configExists,
}
