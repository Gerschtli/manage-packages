'use babel';

import { Disposable, File } from 'atom';
import { assert, restore, stub } from 'sinon';
import FileWatcher from '../lib/file-watcher';
import List from '../lib/list';

describe('ManagePackages', () => {
  afterEach(() => {
    restore();
  });

  it('creates file if not exists', () => {
    const file = new File('/tmp/example');

    const stubGetFile = stub(List, 'getFile').returns(file);
    const stubExistsSync = stub(file, 'existsSync').returns(false);
    const stubCreateFile = stub(List, 'createFile');

    waitsForPromise(() => atom.packages.activatePackage('manage-packages'));

    runs(() => {
      assert.calledOnce(stubGetFile);
      assert.calledOnce(stubExistsSync);
      assert.calledOnce(stubCreateFile);
      assert.calledWith(stubCreateFile, file);
    });
  });

  it('syncs from file if exists', () => {
    const file = new File('/tmp/example');

    const stubGetFile = stub(List, 'getFile').returns(file);
    const stubExistsSync = stub(file, 'existsSync').returns(true);
    const stubSyncFromFile = stub(List, 'syncFromFile');

    waitsForPromise(() => atom.packages.activatePackage('manage-packages'));

    runs(() => {
      assert.calledOnce(stubGetFile);
      assert.calledOnce(stubExistsSync);
      assert.calledOnce(stubSyncFromFile);
    });
  });

  it('syncs from file if file changed', () => {
    const file = new File('/tmp/example');
    const disposable = new Disposable();

    const stubGetFile = stub(List, 'getFile').returns(file);
    const stubExistsSync = stub(file, 'existsSync').returns(true);
    const stubSyncFromFile = stub(List, 'syncFromFile');
    const stubHasChanged = stub(FileWatcher, 'hasChanged').returns(true);

    const stubOnDidChange = stub(file, 'onDidChange').returns(disposable);
    stubOnDidChange.yields();

    waitsForPromise(() => atom.packages.activatePackage('manage-packages'));

    runs(() => {
      assert.calledOnce(stubGetFile);
      assert.calledOnce(stubExistsSync);
      assert.calledTwice(stubSyncFromFile);
      assert.calledOnce(stubHasChanged);

      assert.calledOnce(stubOnDidChange);
    });
  });

  it('syncs from file if file changed but content same', () => {
    const file = new File('/tmp/example');
    const disposable = new Disposable();

    const stubGetFile = stub(List, 'getFile').returns(file);
    const stubExistsSync = stub(file, 'existsSync').returns(true);
    const stubSyncFromFile = stub(List, 'syncFromFile');
    const stubHasChanged = stub(FileWatcher, 'hasChanged').returns(false);

    const stubOnDidChange = stub(file, 'onDidChange').returns(disposable);
    stubOnDidChange.yields();

    waitsForPromise(() => atom.packages.activatePackage('manage-packages'));

    runs(() => {
      assert.calledOnce(stubGetFile);
      assert.calledOnce(stubExistsSync);
      assert.calledOnce(stubSyncFromFile);
      assert.calledOnce(stubHasChanged);

      assert.calledOnce(stubOnDidChange);
    });
  });

  it('creates file if file renamed', () => {
    const file = new File('/tmp/example');
    const disposable = new Disposable();

    const stubGetFile = stub(List, 'getFile').returns(file);
    const stubExistsSync = stub(file, 'existsSync').returns(true);
    const stubSyncFromFile = stub(List, 'syncFromFile');
    const stubCreateFile = stub(List, 'createFile');

    const stubOnDidRename = stub(file, 'onDidRename').returns(disposable);
    stubOnDidRename.yields();

    waitsForPromise(() => atom.packages.activatePackage('manage-packages'));

    runs(() => {
      assert.calledOnce(stubGetFile);
      assert.calledOnce(stubExistsSync);
      assert.calledOnce(stubSyncFromFile);
      assert.calledOnce(stubCreateFile);
      assert.calledWith(stubCreateFile, file);

      assert.calledOnce(stubOnDidRename);
    });
  });

  it('creates file if file deleted', () => {
    const file = new File('/tmp/example');
    const disposable = new Disposable();

    const stubGetFile = stub(List, 'getFile').returns(file);
    const stubExistsSync = stub(file, 'existsSync').returns(true);
    const stubSyncFromFile = stub(List, 'syncFromFile');
    const stubCreateFile = stub(List, 'createFile');

    const stubOnDidDelete = stub(file, 'onDidDelete').returns(disposable);
    stubOnDidDelete.yields();

    waitsForPromise(() => atom.packages.activatePackage('manage-packages'));

    runs(() => {
      assert.calledOnce(stubGetFile);
      assert.calledOnce(stubExistsSync);
      assert.calledOnce(stubSyncFromFile);
      assert.calledOnce(stubCreateFile);
      assert.calledWith(stubCreateFile, file);

      assert.calledOnce(stubOnDidDelete);
    });
  });

  it('syncs to file on package install', () => {
    const file = new File('/tmp/example');
    const disposable = new Disposable();

    const stubGetFile = stub(List, 'getFile').returns(file);
    const stubExistsSync = stub(file, 'existsSync').returns(true);
    const stubSyncFromFile = stub(List, 'syncFromFile');
    const stubSyncToFile = stub(List, 'syncToFile');

    const stubOnActivateInitialPackages = stub(atom.packages, 'onDidActivateInitialPackages').returns(disposable);
    stubOnActivateInitialPackages.yields();
    const stubOnLoadPackage = stub(atom.packages, 'onDidLoadPackage').returns(disposable);
    stubOnLoadPackage.yields();

    waitsForPromise(() => atom.packages.activatePackage('manage-packages'));

    runs(() => {
      assert.calledOnce(stubGetFile);
      assert.calledOnce(stubExistsSync);
      assert.calledOnce(stubSyncFromFile);

      assert.calledOnce(stubOnActivateInitialPackages);
      assert.calledOnce(stubOnLoadPackage);
      assert.calledOnce(stubSyncToFile);
    });
  });

  it('syncs to file on package uninstall', () => {
    const file = new File('/tmp/example');
    const disposable = new Disposable();

    const stubGetFile = stub(List, 'getFile').returns(file);
    const stubExistsSync = stub(file, 'existsSync').returns(true);
    const stubSyncFromFile = stub(List, 'syncFromFile');
    const stubSyncToFile = stub(List, 'syncToFile');

    const stubOnActivateInitialPackages = stub(atom.packages, 'onDidActivateInitialPackages').returns(disposable);
    stubOnActivateInitialPackages.yields();
    const stubOnUnloadPackage = stub(atom.packages, 'onDidUnloadPackage').returns(disposable);
    stubOnUnloadPackage.yields();

    waitsForPromise(() => atom.packages.activatePackage('manage-packages'));

    runs(() => {
      assert.calledOnce(stubGetFile);
      assert.calledOnce(stubExistsSync);
      assert.calledOnce(stubSyncFromFile);

      assert.calledOnce(stubOnActivateInitialPackages);
      assert.calledOnce(stubOnUnloadPackage);
      assert.calledOnce(stubSyncToFile);
    });
  });
});
