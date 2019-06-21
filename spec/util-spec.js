'use babel';

import { assert, restore, stub } from 'sinon';

import Util from '../lib/util';

describe('Util', () => {
  afterEach(() => {
    restore();
  });

  it('tests getAllPackages', () => {
    const stubGetNames = stub(atom.packages, 'getAvailablePackageNames').returns(['a', 'b']);
    const stubIsBundled = stub(atom.packages, 'isBundledPackage');
    stubIsBundled.withArgs('a').returns(true);
    stubIsBundled.withArgs('b').returns(false);

    expect(Util.getAllPackages()).toEqual(['b']);

    assert.calledOnce(stubGetNames);
    assert.calledTwice(stubIsBundled);
  });
});
