'use babel';

import { File } from 'atom';
import { assert, restore, stub } from 'sinon';
import sha256Module from 'js-sha256';
import FileWatcher from '../lib/file-watcher';

describe('FileWatcher', () => {
  afterEach(() => {
    restore();
  });

  it('hasChanged', () => {
    const file = new File('/tmp/example');

    const stubRead = stub(file, 'readSync')
      .onFirstCall()
      .returns('content')
      .onSecondCall()
      .returns('content')
      .onThirdCall()
      .returns('bla');

    const stubSha256 = stub(sha256Module, 'sha256')
      .onFirstCall()
      .returns('123')
      .onSecondCall()
      .returns('123')
      .onThirdCall()
      .returns('234');

    expect(FileWatcher.hasChanged(file)).toEqual(true);

    assert.calledOnce(stubRead);
    assert.calledOnce(stubSha256);
    assert.calledWith(stubSha256.firstCall, 'content');

    expect(FileWatcher.hasChanged(file)).toEqual(false);

    assert.calledTwice(stubRead);
    assert.calledTwice(stubSha256);
    assert.calledWith(stubSha256.secondCall, 'content');

    expect(FileWatcher.hasChanged(file)).toEqual(true);

    assert.calledThrice(stubRead);
    assert.calledThrice(stubSha256);
    assert.calledWith(stubSha256.thirdCall, 'bla');
  });
});
