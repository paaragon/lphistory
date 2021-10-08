const config = require('./config/config');
const search = require('./search/search');

module.exports = {
  printLpHistory: search.printLpHistory,
  configProcess: config.configProcess,
  createConfig: config.createConfig,
  clearConfig: config.clearConfig,
  listConfig: config.listConfig,
};
