with import <nixpkgs> { };

stdenv.mkDerivation {
  name = "manage-packages";

  buildInputs = [
    nodejs
  ];
}
