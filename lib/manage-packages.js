'use babel';

import { CompositeDisposable } from 'atom';
import List from './list';

export default {

  disposables: null,

  activate() {
    const file = List.getFile();
    if (!file.existsSync()) {
      List.createFile(file);
    } else {
      List.syncFromFile();
    }

    this.disposables = new CompositeDisposable();
    this.disposables.add(
      file.onDidChange(() => List.syncFromFile()),
      file.onDidRename(() => List.createFile(file)),
      file.onDidDelete(() => List.createFile(file)),
    );

    this.disposables.add(
      atom.packages.onDidActivateInitialPackages(() => {
        this.disposables.add(
          atom.packages.onDidLoadPackage(() => List.syncToFile()),
          atom.packages.onDidUnloadPackage(() => List.syncToFile())
        );
      })
    );
  },

  deactivate() {
    if (this.disposables !== null) {
      this.disposables.dispose();
    }
  },

};
