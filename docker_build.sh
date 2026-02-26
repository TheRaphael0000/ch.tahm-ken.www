#!/bin/sh
echo $VITE_BUILD_VERSION

# install dependencies
npm ci

# download cache files
npm run cache

# build web assembly optimizer
npm run wasm:data
npm run wasm:build

# build webapp
npm run build

# copy artifacts
rsync -a --delete /app/build/ /build/