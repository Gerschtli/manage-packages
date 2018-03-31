'use babel';

import { BufferedProcess } from 'atom';

export default class Apm {

  apmPath = atom.packages.getApmPath();
  queue = [];
  runningProcess = null;

  addToApmQueue(name, install) {
    this.queue.push({ name, install });
    this.startNextInQueue();
  }

  executeApm(name, install) {
    const command = this.apmPath;
    const args = [(install ? 'install' : 'uninstall'), name];
    const stdout = () => {};
    const stderr = () => {};
    const exit = () => {
      this.runningProcess = null;
      this.startNextInQueue();
    };

    this.runningProcess = new BufferedProcess({ command, args, stdout, stderr, exit });
  }

  install(name) {
    this.add(name, true);
  }

  startNextInQueue() {
    if (this.queue.length !== 0 && this.runningProcess === null) {
      const element = this.queue.shift();
      this.executeApm(element.name, element.install);
    }
  }

  uninstall(name) {
    this.add(name, false);
  }

}
