# manage-packages [![Travis CI](https://img.shields.io/travis/Gerschtli/manage-packages.svg?style=flat-square)](https://travis-ci.org/Gerschtli/manage-packages) [![apm](https://img.shields.io/apm/v/manage-packages.svg?style=flat-square)](https://atom.io/packages/manage-packages) [![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)

An [atom](https://atom.io/) package for managing packages via a dotfiles repository for example by syncing the installed package list to `~/.atom/packages.cson`.

It automatically creates and installs all packages of `~/.atom/packages.cson` and watches the file for changes.

If you install or uninstall a package in atom, `~/.atom/packages.cson` will be updated.

Example content of `~/.atom/packages.cson`:

```cson
packages: [
  "atom-beautify"
  "sort-lines"
]
```
