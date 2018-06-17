'use babel';

import { sha256 } from 'js-sha256';

export default {

  lastSha256: null,

  hasChanged(file) {
    const currentSha256 = sha256(file.readSync());
    const hasChanged = currentSha256 !== this.lastSha256;
    this.lastSha256 = currentSha256;

    return hasChanged;
  },

};
