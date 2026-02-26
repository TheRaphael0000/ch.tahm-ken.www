# Tahm-ken.ch

This repository contain the front-end for the Tahm-ken.ch website v2. Built in Svelte NodeJs and Rust compiled in WebAssembly (with wasm-pack).
For the back-end: https://github.com/TheRaphael0000/ch.tahm-ken.www-api/

Dependencies:

- NodeJS (https://nodejs.org/en/download)
- Rust (https://rust-lang.org/tools/install/)
- Python (https://www.python.org/downloads/)

I personally uses the WSL.

You can also use docker to build it (no dev capabilities yet)

## Dev Setup

```bash
npm i # install node dependencies
npm run cache # download datadragon and discord cache files

# (Optional)
# Run from a Windows CLI with access to the League Client (must be running)
python update_challenges.py

# (Require Rust and Python)
npm run wasm:data # Convert the LCU challenge file to a rust file (code generation)
npm run wasm:build # Build the WebAssembly lib

npm run dev # Run the vite dev server
```

## Test CI / Docker Build

```bash
# clean git if you want to do a clean build
git clean -xfd

docker compose up --build

# build with version number
VITE_BUILD_VERSION=$(git describe --tags | tr -d '\n') docker compose up --build
```

Wses 2 cache volumes:

- data/datadragon -> cache the big data dragon file
- data/node_modules -> cache the node modules

Output volume:

- data/build -> build output
