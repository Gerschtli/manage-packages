'use babel';

import { BufferedProcess } from 'atom';

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
        atom.notifications.addError(`An error occured while ${install ? '' : 'un'}nstalling ${name}`);
      }
      this.runningProcess = null;
      this.startNextInQueue();
    };

    this.runningProcess = this.startProcess(this.apmPath, args, () => {}, () => {}, exit);
  },

  install(name) {
    this.add(name, true);
  },

  startNextInQueue() {
    if (this.queue.length === 0 || this.runningProcess !== null) {
      return;
    }

    const all = atom.packages.getAvailablePackageNames()
      .filter(name => !atom.packages.isBundledPackage(name));
    const element = this.queue.shift();

    // skip elements which dont change the state of a package (remove duplicates)
    if (all.includes(element.name) === element.install) {
      this.startNextInQueue();
      return;
    }

    this.executeApm(element.name, element.install);
  },

  startProcess(command, args, stdout, stderr, exit) {
    return new BufferedProcess({ command, args, stdout, stderr, exit });
  },

  uninstall(name) {
    this.add(name, false);
  },

};
