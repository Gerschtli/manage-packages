'use babel';

import { assert, restore, stub } from 'sinon';

import Apm from '../lib/apm';
import Util from '../lib/util';

describe('Apm', () => {
  beforeEach(() => {
    Apm.queue = [];
    Apm.runningProcess = null;
  });

  afterEach(() => {
    restore();
  });

  it('tests addToApmQueue', () => {
    const stubStartNext = stub(Apm, 'startNextInQueue');

    Apm.addToApmQueue('name', true);
    expect(Apm.queue).toEqual([{ name: 'name', install: true }]);

    assert.calledOnce(stubStartNext);
  });

  describe('tests executeApm', () => {
    it('saves running process', () => {
      const stubStartProcess = stub(Apm, 'startProcess').returns('running');

      Apm.executeApm('name', true);
      expect(Apm.runningProcess).toBe('running');

      assert.calledOnce(stubStartProcess);
      assert.calledWith(stubStartProcess, ['install', 'name']);
    });

    it('when install and success', () => {
      const stubStartProcess = stub(Apm, 'startProcess').callsArgWith(1, 0);
      const stubAddSuccess = stub(atom.notifications, 'addSuccess');
      const stubStartNext = stub(Apm, 'startNextInQueue');

      Apm.executeApm('name', true);

      assert.calledOnce(stubStartProcess);
      assert.calledWith(stubStartProcess, ['install', 'name']);
      assert.calledOnce(stubAddSuccess);
      assert.calledWith(stubAddSuccess, 'Installed name');
      assert.calledOnce(stubStartNext);
    });

    it('when install and error', () => {
      const stubStartProcess = stub(Apm, 'startProcess').callsArgWith(1, 12);
      const stubAddError = stub(atom.notifications, 'addError');
      const stubStartNext = stub(Apm, 'startNextInQueue');

      Apm.executeApm('name', true);

      assert.calledOnce(stubStartProcess);
      assert.calledWith(stubStartProcess, ['install', 'name']);
      assert.calledOnce(stubAddError);
      assert.calledWith(stubAddError, 'An error occured while installing name');
      assert.calledOnce(stubStartNext);
    });

    it('when uninstall and success', () => {
      const stubStartProcess = stub(Apm, 'startProcess').callsArgWith(1, 0);
      const stubAddSuccess = stub(atom.notifications, 'addSuccess');
      const stubStartNext = stub(Apm, 'startNextInQueue');

      Apm.executeApm('name', false);

      assert.calledOnce(stubStartProcess);
      assert.calledWith(stubStartProcess, ['uninstall', 'name']);
      assert.calledOnce(stubAddSuccess);
      assert.calledWith(stubAddSuccess, 'Uninstalled name');
      assert.calledOnce(stubStartNext);
    });

    it('when uninstall and error', () => {
      const stubStartProcess = stub(Apm, 'startProcess').callsArgWith(1, 12);
      const stubAddError = stub(atom.notifications, 'addError');
      const stubStartNext = stub(Apm, 'startNextInQueue');

      Apm.executeApm('name', false);

      assert.calledOnce(stubStartProcess);
      assert.calledWith(stubStartProcess, ['uninstall', 'name']);
      assert.calledOnce(stubAddError);
      assert.calledWith(stubAddError, 'An error occured while uninstalling name');
      assert.calledOnce(stubStartNext);
    });
  });

  describe('tests startNextInQueue', () => {
    it('when queue empty', () => {
      const stubExecuteApm = stub(Apm, 'executeApm');

      Apm.startNextInQueue();

      assert.notCalled(stubExecuteApm);
    });

    it('when process running', () => {
      Apm.queue = [
        { name: 'name', install: true },
      ];
      Apm.runningProcess = 1;

      const stubExecuteApm = stub(Apm, 'executeApm');

      Apm.startNextInQueue();

      assert.notCalled(stubExecuteApm);
    });

    it('when execute current element', () => {
      Apm.queue = [
        { name: 'name', install: true },
      ];

      const stubAllPackages = stub(Util, 'getAllPackages').returns([]);
      const stubExecuteApm = stub(Apm, 'executeApm');

      Apm.startNextInQueue();
      expect(Apm.queue).toEqual([]);

      assert.calledOnce(stubAllPackages);
      assert.calledOnce(stubExecuteApm);
      assert.calledWith(stubExecuteApm, 'name', true);
    });

    it('when skip current element', () => {
      Apm.queue = [
        { name: 'name1', install: true },
        { name: 'name2', install: false },
      ];

      const stubAllPackages = stub(Util, 'getAllPackages').returns(['name1', 'name2']);
      const stubExecuteApm = stub(Apm, 'executeApm');

      Apm.startNextInQueue();
      expect(Apm.queue).toEqual([]);

      assert.calledTwice(stubAllPackages);
      assert.calledOnce(stubExecuteApm);
      assert.calledWith(stubExecuteApm, 'name2', false);
    });
  });
});
