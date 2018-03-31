'use babel';

import { CompositeDisposable } from 'atom';
import List from './list';

export default {

  disposables: null,
  list: null,

  activate() {
    this.list = new List();

    const file = this.list.getFile();
    if (!file.existsSync()) {
      this.list.createFile();
    } else {
      this.list.syncFromFile();
    }

    this.disposables = new CompositeDisposable();
    this.disposables.add(
      file.onDidChange(this.list.syncFromFile),
      file.onDidRename(this.list.createFile),
      file.onDidDelete(this.list.createFile),
    );

    atom.packages.onDidActivateInitialPackages(() => {
      atom.packages.onDidLoadPackage(this.list.syncToFile);
      atom.packages.onDidUnloadPackage(this.list.syncToFile);
    });
  },

  deactivate() {
    if (this.disposables !== null) {
      this.disposables.dispose();
    }
  },

};
