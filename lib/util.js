'use babel';

export default {

  getAllPackages() {
    return atom.packages.getAvailablePackageNames()
      .filter((name) => !atom.packages.isBundledPackage(name));
  },

};
