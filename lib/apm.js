'use babel';

import { BufferedProcess } from 'atom';

import Util from './util';

export default {

  apmPath: atom.packages.getApmPath(),
  queue: [],
  runningProcess: null,

  addToApmQueue(name, install) {
    this.queue.push({ name, install });
    this.startNextInQueue();
  },

  executeApm(name, install) {
    const args = [(install ? 'install' : 'uninstall'), name];
    const exit = (exitCode) => {
      if (exitCode === 0) {
        atom.notifications.addSuccess(`${install ? 'I' : 'Uni'}nstalled ${name}`);
      } else {
        atom.notifications.addError(`An error occured while ${install ? '' : 'un'}installing ${name}`);
      }
      this.runningProcess = null;
      this.startNextInQueue();
    };

    this.runningProcess = this.startProcess(args, exit);
  },

  startNextInQueue() {
    if (this.queue.length === 0 || this.runningProcess !== null) {
      return;
    }

    const all = Util.getAllPackages();
    const element = this.queue.shift();

    // skip elements which dont change the state of a package (remove duplicates)
    if (all.includes(element.name) === element.install) {
      this.startNextInQueue();
      return;
    }

    this.executeApm(element.name, element.install);
  },

  startProcess(args, exit) {
    const command = this.apmPath;
    const stdout = () => {};
    const stderr = () => {};

    return new BufferedProcess({
      command, args, stdout, stderr, exit,
    });
  },

};
