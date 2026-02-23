#!/bin/sh

echo $VITE_BUILD_VERSION
npm ci
node cache/cache.js
npm run build
rsync -a --delete /app/build/ /build/