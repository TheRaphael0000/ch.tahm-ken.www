#!/bin/sh
echo pwd: $(pwd)
echo version: $VITE_BUILD_VERSION

# install dependencies
npm ci

# download cache files
npm run cache

# build web assembly optimizer
rustup target add wasm32-unknown-unknown
npm run wasm:data
npm run wasm:build

# build webapp
npm run build