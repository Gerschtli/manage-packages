'use babel';

import { File } from 'atom';
import { assert, stub } from 'sinon';
import path from 'path';
import CSON from 'season';
import Apm from '../lib/apm';
import List from '../lib/list';

describe('List', () => {
  it('tests createFile', () => {
    const file = new File('/tmp/example');

    const stubCreate = stub(file, 'create');
    const stubSyncToFile = stub(List, 'syncToFile');

    List.createFile(file);

    stubCreate.restore();
    stubSyncToFile.restore();

    assert.calledOnce(stubCreate);
    assert.calledOnce(stubSyncToFile);
  });

  it('tests getAllPackages', () => {
    const stubGetNames = stub(atom.packages, 'getAvailablePackageNames').returns(['a', 'b']);
    const stubIsBundled = stub(atom.packages, 'isBundledPackage');
    stubIsBundled.withArgs('a').returns(true);
    stubIsBundled.withArgs('b').returns(false);

    expect(List.getAllPackages()).toEqual(['b']);

    stubGetNames.restore();
    stubIsBundled.restore();

    assert.calledOnce(stubGetNames);
    assert.calledTwice(stubIsBundled);
  });

  it('tests getFile', () => {
    const stubGetFilePath = stub(List, 'getFilePath').returns('/tmp/example');

    const file = List.getFile();
    expect(file.path).toBe('/tmp/example');
    expect(file.symlink).toBe(true);

    stubGetFilePath.restore();

    assert.calledOnce(stubGetFilePath);
  });

  it('tests getFilePath', () => {
    const stubConfigPath = stub(atom, 'getConfigDirPath').returns('/atom/config');
    const stubJoin = stub(path, 'join').returns('/atom/config/packages.cson');

    expect(List.getFilePath()).toBe('/atom/config/packages.cson');

    stubConfigPath.restore();
    stubJoin.restore();

    assert.calledOnce(stubConfigPath);
    assert.calledOnce(stubJoin);
    assert.calledWith(stubJoin, '/atom/config', 'packages.cson');
  });

  describe('tests syncFromFile', () => {
    it('when content of file is empty', () => {
      const stubGetFilePath = stub(List, 'getFilePath').returns('/tmp/example');
      const stubReadFile = stub(CSON, 'readFileSync').returns('');
      const stubSyncToFile = stub(List, 'syncToFile');

      List.syncFromFile();

      stubGetFilePath.restore();
      stubReadFile.restore();
      stubSyncToFile.restore();

      assert.calledOnce(stubGetFilePath);
      assert.calledOnce(stubReadFile);
      assert.calledOnce(stubSyncToFile);
    });

    it('when packages property of file is not an array', () => {
      const stubGetFilePath = stub(List, 'getFilePath').returns('/tmp/example');
      const stubReadFile = stub(CSON, 'readFileSync').returns({ packages: 15 });
      const stubSyncToFile = stub(List, 'syncToFile');

      List.syncFromFile();

      stubGetFilePath.restore();
      stubReadFile.restore();
      stubSyncToFile.restore();

      assert.calledOnce(stubGetFilePath);
      assert.calledOnce(stubReadFile);
      assert.calledOnce(stubSyncToFile);
    });

    it('with adding to apm queue', () => {
      const stubGetFilePath = stub(List, 'getFilePath').returns('/tmp/example');
      const stubReadFile = stub(CSON, 'readFileSync').returns({ packages: ['a', 'b', 'c'] });
      const stubGetAllPackages = stub(List, 'getAllPackages').returns(['c', 'd']);
      const stubApmQueue = stub(Apm, 'addToApmQueue');

      List.syncFromFile();

      stubGetFilePath.restore();
      stubReadFile.restore();
      stubGetAllPackages.restore();
      stubApmQueue.restore();

      assert.calledOnce(stubGetFilePath);
      assert.calledOnce(stubReadFile);
      assert.calledOnce(stubGetAllPackages);
      assert.calledThrice(stubApmQueue);
      assert.calledWith(stubApmQueue.firstCall, 'a', true);
      assert.calledWith(stubApmQueue.secondCall, 'b', true);
      assert.calledWith(stubApmQueue.thirdCall, 'd', false);
    });
  });

  it('tests syncToFile', () => {
    const stubGetFilePath = stub(List, 'getFilePath').returns('/tmp/example');
    const stubGetAllPackages = stub(List, 'getAllPackages').returns(['c', 'd']);
    const stubWriteFile = stub(CSON, 'writeFileSync');

    List.syncToFile();

    stubGetFilePath.restore();
    stubWriteFile.restore();
    stubGetAllPackages.restore();

    assert.calledOnce(stubGetFilePath);
    assert.calledOnce(stubGetAllPackages);
    assert.calledOnce(stubWriteFile);
    assert.calledWith(stubWriteFile, '/tmp/example', { packages: ['c', 'd'] });
  });
});
