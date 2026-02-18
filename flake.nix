{
  description = "Watercolor - Tsinghua University course selector/scraper";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        python = pkgs.python3.withPackages (ps: with ps; [
          selenium
          requests
          beautifulsoup4
          lxml
          pandas
        ]);
      in
      {
        devShells = {
          # Scraper shell: Python + Selenium + Firefox
          default = pkgs.mkShell {
            buildInputs = [
              python
              pkgs.geckodriver
              pkgs.firefox
            ];

            shellHook = ''
              echo "Watercolor scraper environment"
              echo "Python: $(python --version)"
              echo "Geckodriver: $(geckodriver --version | head -1)"
            '';
          };

          # Web app shell: Node.js + pnpm
          web = pkgs.mkShell {
            buildInputs = [
              pkgs.nodejs
              pkgs.pnpm
            ];

            shellHook = ''
              echo "Watercolor web development environment"
              echo "Node: $(node --version)"
              echo "pnpm: $(pnpm --version)"
            '';
          };
        };
      }
    );
}
