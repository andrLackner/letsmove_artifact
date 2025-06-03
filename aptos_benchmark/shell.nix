let
  pin = fetchTarball "https://github.com/NixOS/nixpkgs/archive/910796cabe436259a29a72e8d3f5e180fc6dfacc.tar.gz";
  pkgs = import (pin) {};
in

pkgs.mkShellNoCC {
  packages = with pkgs; [
    (python3.withPackages (python-pkgs: [
      python-pkgs.requests
    ]))
    zstd
  ];
}

