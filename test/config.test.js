const expect = require('chai').expect;
const config = require('../lib/config/config');
const mockFs = require('mock-fs');
const path = require('path');

const CONFIG_FOLDER = path.join(__dirname, '.', '..', 'lib', 'config', 'files');

describe('Config test', () => {
  afterEach(() => {
    mockFs.restore();
  });
  describe('getExistentEnvs', () => {
    it('No env, no files', () => {
      const configFolder = path.join(__dirname, '.', '..', 'lib', 'config', 'files');
      const mock = {};
      mock[configFolder] = {};
      mockFs(mock);
      const envs = config._getExistentEnvs();
      expect(envs.length).to.be.eq(0);
    });
    it('No env, two files', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.uat.json': '',
        'config.default.json': '',
      };
      mockFs(mock);
      const envs = config._getExistentEnvs();
      expect(envs.length).to.be.eq(2);
    });
    it('Env, one files', () => {
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
    it('Env, no files', () => {
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
    it('No env', () => {
      const cPath = config._getConfigPath();
      expect(cPath).to.be.a('string').and.match(/.*config.default.json/);
    });
    it('With env', () => {
      const cPath = config._getConfigPath('uat');
      expect(cPath).to.be.a('string').and.match(/.*config.uat.json/);
    });
  });
  describe('configExists', () => {
    it(`Config exists without env`, () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.default.json': '',
        'config.uat.json': '',
      };
      mockFs(mock);
      const exists = config._configExists();
      expect(exists).to.be.true;
    });
    it('Config exists with env', () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.uat.json': '',
        'config.default.json': '',
      };
      mockFs(mock);
      const exists = config._configExists('uat');
      expect(exists).to.be.true;
    });
    it(`Config doesn't exists without env`, () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {};
      mockFs(mock);
      const exists = config._configExists();
      expect(exists).to.be.false;
    });
    it(`Config doesn't exists with env`, () => {
      const mock = {};
      mock[CONFIG_FOLDER] = {
        'config.default': '',
      };
      mockFs(mock);
      const exists = config._configExists('uat');
      expect(exists).to.be.false;
    });
  });
});