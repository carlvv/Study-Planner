{
  description = "Python development environment with declarative pip packages";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        # Define your Python version here
        python = pkgs.python311;
        
        # Read pip packages from requirements.txt
        # This ensures compatibility with developers not using Nix
        requirementsFile = ./requirements.txt;
        
        # Create a Python environment with the specified packages
        pythonEnv = python.withPackages (ps: with ps; [
          pip
          virtualenv
          setuptools
          wheel
        ]);
        
        # Create a script to set up the virtual environment with pip packages
        setupScript = pkgs.writeShellScriptBin "setup-python-env" ''
          echo "Setting up Python virtual environment..."
          
          # Create venv if it doesn't exist
          if [ ! -d ".venv" ]; then
            ${pythonEnv}/bin/python -m venv .venv
            echo "Virtual environment created at .venv"
          fi
          
          # Activate and install packages
          source .venv/bin/activate
          
          # Upgrade pip
          pip install --upgrade pip
          
          # Install packages from requirements.txt
          if [ -f "requirements.txt" ]; then
            echo "Installing packages from requirements.txt..."
            pip install -r requirements.txt
          else
            echo "Warning: requirements.txt not found"
          fi
          
          echo "Python environment setup complete!"
          echo "Run 'source .venv/bin/activate' to activate the environment"
        '';
        
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pythonEnv
            setupScript
            pkgs.git
          ];
          
          shellHook = ''
            echo "Python Development Environment"
            echo "=============================="
            echo ""
            echo "Python version: ${python.version}"
            echo ""
            echo "To set up the virtual environment with pip packages, run:"
            echo "  setup-python-env"
            echo ""
            echo "To activate the virtual environment:"
            echo "  source .venv/bin/activate"
            echo ""
            echo "To add more pip packages, edit requirements.txt and run setup-python-env again"
            echo ""
            
            # Auto-activate venv if it exists
            if [ -d ".venv" ]; then
              source .venv/bin/activate
              echo "✓ Virtual environment activated"
            else
              echo "→ Run 'setup-python-env' to create the virtual environment"
            fi
          '';
        };
      }
    );
}
