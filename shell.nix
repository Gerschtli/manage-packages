with import <nixpkgs> { };

mkShell {
  buildInputs = [
    atom
    nodejs
  ];
}
