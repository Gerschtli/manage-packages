'use babel';

import { File } from 'atom';
import * as path from 'path';
import * as CSON from 'season';
import Apm from './apm';

export default class List {

  apm = null;
  file = null;

  constructor() {
    this.apm = new Apm();
    this.file = new File(this.getFilePath(), true);
  }

  createFile() {
    this.getFile().create();
    this.syncToFile();
  }

  static getAllPackages() {
    return atom.packages.getAvailablePackageNames()
      .filter(name => !atom.packages.isBundledPackage(name));
  }

  getFile() {
    return this.file;
  }

  static getFilePath() {
    return path.join(atom.getConfigDirPath(), 'manager.cson');
  }

  syncFromFile() {
    const content = CSON.readFileSync(this.getFilePath());
    if (!Array.isArray(content.packages)) {
      this.syncToFile();
      return;
    }

    const allPackages = this.getAllPackages();
    const toInstall = content.packages.filter(name => !allPackages.includes(name));
    const toUninstall = allPackages.filter(name => !content.packages.includes(name));

    toInstall.forEach((name) => { this.apm.addToApmQueue(name, true); });
    toUninstall.forEach((name) => { this.apm.addToApmQueue(name, false); });
  }

  syncToFile() {
    CSON.writeFileSync(this.getFilePath(), { packages: this.getAllPackages() });
  }

}
