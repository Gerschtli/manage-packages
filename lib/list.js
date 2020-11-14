'use babel';

import { File } from 'atom';
import path from 'path';
import CSON from 'season';

import Apm from './apm';
import Util from './util';

export default {

  createFile(file) {
    file.create();
    this.syncToFile();
  },

  getFile() {
    return new File(this.getFilePath(), true);
  },

  getFilePath() {
    return path.join(atom.getConfigDirPath(), 'packages.cson');
  },

  notify(message, list) {
    if (list.length) {
      atom.notifications.addInfo(
        message,
        {
          detail: list.join('\n'),
        },
      );
    }
  },

  syncFromFile() {
    const content = CSON.readFileSync(this.getFilePath());
    if (!content || !Array.isArray(content.packages)) {
      this.syncToFile();
      return;
    }

    const allPackages = Util.getAllPackages();
    const toInstall = content.packages.filter((name) => !allPackages.includes(name));
    this.notify('Packages to install', toInstall);
    toInstall.forEach((name) => { Apm.addToApmQueue(name, true); });

    if (atom.config.get('manage-packages.uninstall')) {
      const toUninstall = allPackages.filter((name) => !content.packages.includes(name));
      this.notify('Packages to uninstall', toUninstall);
      toUninstall.forEach((name) => { Apm.addToApmQueue(name, false); });
    }
  },

  syncToFile() {
    CSON.writeFileSync(this.getFilePath(), { packages: Util.getAllPackages() });
  },

};
