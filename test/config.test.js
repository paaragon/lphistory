const { expect } = require('chai');
const mockFs = require('mock-fs');
const path = require('path');
const sinon = require('sinon');
const fs = require('fs');
const {
  describe, it, afterEach, beforeEach,
} = require('mocha');
const config = require('../lib/config/config');

const CONFIG_FOLDER = path.join(__dirname, '.', '..', 'lib', 'config', 'files');

describe('Config test', () => {
  describe('getExistentEnvs', () => {
    afterEach(() => {
      mockFs.restore();
      sinon.restore();
    });
    it('If no environment in fs and no env specified, existent environments should be 0.', () => {
      const configFolder = path.join(__dirname, '.', '..', 'lib', 'config', 'files');
      const mock = {};
      mock[configFolder] = {};
      mockFs(mock);
      const envs = config._getExistentEnvs();
      expect(envs.length).to.be.eq(0);
    });
    it('If two environments in fs and no env specified, existent environments should be 2.', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.uat.json': '',
        'config.default.json': '',
      };
      mockFs(mock);
      const envs = config._getExistentEnvs();
      expect(envs.length).to.be.eq(2);
    });
    it('If environment is specified and it exists in fs, existent env length should be 1.', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.uat.json': '',
        'config.default.json': '',
      };
      mockFs(mock);
      const envs = config._getExistentEnvs('uat');
      expect(envs.length).to.be.eq(1);
      expect(envs[0]).to.be.eq('uat');
    });
    it('If environment is specified and it doesn\'t exists in fs, existent env length should be 0.', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.uat.json': '',
        'config.default.json': '',
      };
      mockFs(mock);
      const envs = config._getExistentEnvs('pro');
      expect(envs.length).to.be.eq(0);
    });
  });
  describe('getConfigPath', () => {
    afterEach(() => {
      mockFs.restore();
      sinon.restore();
    });
    it('If no env is provided, retrieved path should be config.default.json.', () => {
      const cPath = config._getConfigPath();
      expect(cPath).to.be.a('string').and.match(/.*config.default.json/);
    });
    it('If env is provided, retrieved path should be the one corresponding to the environment.', () => {
      const cPath = config._getConfigPath('uat');
      expect(cPath).to.be.a('string').and.match(/.*config.uat.json/);
    });
  });
  describe('configExists', () => {
    afterEach(() => {
      mockFs.restore();
      sinon.restore();
    });
    it('If no env provided and 2 files in fs, config must exists.', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.default.json': '',
        'config.uat.json': '',
      };
      mockFs(mock);
      const exists = config._configExists();
      expect(exists).to.be.true;
    });
    it('If env is provided and corresponding file is in fs, config must exists.', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.uat.json': '',
        'config.default.json': '',
      };
      mockFs(mock);
      const exists = config._configExists('uat');
      expect(exists).to.be.true;
    });
    it('If no env provided and no files in fs, config mustn\'t exists.', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {};
      mockFs(mock);
      const exists = config._configExists();
      expect(exists).to.be.false;
    });
    it('If env is provided and corresponding file isn\'t in fs, config mustn\'t exists.', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.default.json': '',
      };
      mockFs(mock);
      const exists = config._configExists('uat');
      expect(exists).to.be.false;
    });
  });
  describe('configProcess', () => {
    beforeEach(() => {
      mockFs.restore();
    });
    // it('No config', async () => {
    //   const mock = {};
    //   mock[CONFIG_FOLDER] = {};
    //   mockFs(mock);
    //   const qStub = sinon.stub(question, 'question');
    //   qStub.callsFake((q) => { console.log(q); return Promise.resolve('asdf'); });
    //   await config.configProcess('pro');
    //   const json = config.getConfig('pro');
    //   qStub.restore();
    //   expect(JSON.stringify(json)).to.be.eq(configMocks.asdf);
    // });
    it('Existent config', async () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.uat.json': '',
        'config.default.json': '',
      };
      mockFs(mock);
      const consoleSpy = sinon.spy(console, 'log');
      await config.configProcess('uat');
      expect(consoleSpy.getCall(0).args[0]).has.to.be.eq('\nSearching conversation with \u001b[32muat\u001b[39m credentials');
      consoleSpy.restore();
    });
  });
  describe('clearConfig', () => {
    afterEach(() => {
      mockFs.restore();
      sinon.restore();
    });
    it('Clear all', async () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.default.json': '',
        'config.uat.json': '',
        'config.pro.json': '',
      };
      mockFs(mock);
      config.clearConfig();
      const files = fs.readdirSync(CONFIG_FOLDER);
      expect(files.length).to.be.eq(0);
    });
    it('Clear one', async () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.default.json': '',
        'config.uat.json': '',
        'config.pro.json': '',
      };
      mockFs(mock);
      config.clearConfig('uat');
      const files = fs.readdirSync(CONFIG_FOLDER);
      expect(files.length).to.be.eq(2);
    });
  });
  describe('getConfig', () => {
    afterEach(() => {
      mockFs.restore();
      sinon.restore();
    });
    it('If no env is provided and corresponding file is in fs, file content be retrieve.', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.default.json': '{"default": "default"}',
        'config.uat.json': '',
        'config.pro.json': '',
      };
      mockFs(mock);
      const json = config.getConfig();
      expect(JSON.stringify(json)).to.be.be.eq('{"default":"default"}');
    });
    it('If no env is provided and no files in fs, file content not retrieved.', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
      };
      mockFs(mock);
      const json = config.getConfig();
      expect(json).to.be.be.eq(null);
    });
  });
  describe('listConfig', () => {
    afterEach(() => {
      mockFs.restore();
      sinon.restore();
    });
    it('If no files in fs, no config is printed.', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {};
      mockFs(mock);
      const consoleSpy = sinon.spy(console, 'log');
      config.listConfig();
      expect(consoleSpy.getCall(0).args[0]).has.to.be.eq('\u001b[31m\n    NO CONFIGURATION FOUND\u001b[39m');
      consoleSpy.restore();
    });
    it('If no config files in fs and env provided, no config is printed', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.default.json': '{"accountId": 1, "consumerKey": 2, "consumerSecret": 3, "token": 4, "tokenSecret": 5}',
        'config.uat.json': '{"accountId": 1, "consumerKey": 2, "consumerSecret": 3, "token": 4, "tokenSecret": 5}',
      };
      mockFs(mock);
      const consoleSpy = sinon.spy(console, 'log');
      config.listConfig('pro');
      expect(consoleSpy.getCall(0).args[0]).has.to.be.eq('\u001b[31m\n    NO CONFIGURATION FOUND FOR ENVIRONMENT\u001b[39m');
      consoleSpy.restore();
    });
    it('If config files in fs and no env provided, all config files printed', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.default.json': '{"accountId": 1, "consumerKey": 2, "consumerSecret": 3, "token": 4, "tokenSecret": 5}',
        'config.uat.json': '{"accountId": 1, "consumerKey": 2, "consumerSecret": 3, "token": 4, "tokenSecret": 5}',
      };
      mockFs(mock);
      const consoleSpy = sinon.spy(console, 'log');
      config.listConfig();
      const outputs = [
        ['\n  ENVIRONMENT:', '\u001b[32mdefault\u001b[39m'],
        ['    Account id:     ', '\u001b[33m1\u001b[39m'],
        ['    Consumer key:   ', '\u001b[33m2\u001b[39m'],
        ['    Consumer secret:', '\u001b[33m3\u001b[39m'],
        ['    Token:          ', '\u001b[33m4\u001b[39m'],
        ['    Token secret:   ', '\u001b[33m5\u001b[39m'],
        ['\n  ENVIRONMENT:', '\u001b[32muat\u001b[39m'],
        ['    Account id:     ', '\u001b[33m1\u001b[39m'],
        ['    Consumer key:   ', '\u001b[33m2\u001b[39m'],
        ['    Consumer secret:', '\u001b[33m3\u001b[39m'],
        ['    Token:          ', '\u001b[33m4\u001b[39m'],
        ['    Token secret:   ', '\u001b[33m5\u001b[39m'],
      ];
      const outputEntries = outputs.entries();
      for (let i = 0; i < outputEntries; i += 1) {
        const [index, out] = outputEntries[i];
        for (let j = 0; j < out.length; j += 1) {
          expect(consoleSpy.getCall(index).args[j]).has.to.be.eq(out[j]);
        }
      }
      consoleSpy.restore();
    });
  });
});
