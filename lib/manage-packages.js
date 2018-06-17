'use babel';

import { CompositeDisposable } from 'atom';
import FileWatcher from './file-watcher';
import List from './list';

export default {

  config: {
    uninstall: {
      title: 'Uninstall packages',
      description: 'Uninstall packages not listed in packages.cson.',
      type: 'boolean',
      default: true,
    },
  },

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
      file.onDidChange(() => {
        // when the file gets changed, three onChange events get triggered..
        // only god knows why ¯\_(ツ)_/¯
        if (FileWatcher.hasChanged(file)) {
          List.syncFromFile();
        }
      }),
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
