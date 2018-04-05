'use babel';

import { File } from 'atom';
import path from 'path';
import CSON from 'season';
import Apm from './apm';

export default {

  createFile(file) {
    file.create();
    this.syncToFile();
  },

  getAllPackages() {
    return atom.packages.getAvailablePackageNames()
      .filter(name => !atom.packages.isBundledPackage(name));
  },

  getFile() {
    return new File(this.getFilePath(), true);
  },

  getFilePath() {
    return path.join(atom.getConfigDirPath(), 'packages.cson');
  },

  syncFromFile() {
    const content = CSON.readFileSync(this.getFilePath());
    if (!content || !Array.isArray(content.packages)) {
      this.syncToFile();
      return;
    }

    const allPackages = this.getAllPackages();
    const toInstall = content.packages.filter(name => !allPackages.includes(name));
    toInstall.forEach((name) => { Apm.addToApmQueue(name, true); });

    if (atom.config.get('manage-packages.uninstall')) {
      const toUninstall = allPackages.filter(name => !content.packages.includes(name));
      toUninstall.forEach((name) => { Apm.addToApmQueue(name, false); });
    }
  },

  syncToFile() {
    CSON.writeFileSync(this.getFilePath(), { packages: this.getAllPackages() });
  },

};
