# Tahm-ken.ch

This repository contain the front-end for the Tahm-ken.ch website v2.
It uses Javascript with Svelte on Node.

## Setup

First you either need to choose between using the production backend or running your own backend locally.

### Back-end

The default behaviour of the front-end in dev is to use the production back-end.
If you want to use the dev back-end please follow this readme: https://github.com/TheRaphael0000/api.tahm-ken.ch/

### Update caches

#### Datadragon / Discord

This will download files from datadragon and discord API to initalized cached data

```
node cache/cache.js
```

#### Update LCU cache

The files created by this script are commited to the repository, so you don't need to run this script if you want to run the app with the current challenges data.

Run this python script with your League of Legends client open. This will ask the LCU for the latest challenges every profile specific data will be discarded.

You can't run this in the WSL. You must run this in Windows directly so it can communicate with League.

```python
python update_challenges.py
```

### Run the Dev server

```bash
npm i # install dependencies
npm run dev # run dev env
```

Follow instructions in the console.

## Build

Please check that the build pass before pushing

```bash
npm run build # build
npm run preview # test the build
```

Or with Docker (used by the CI/CD)

```bash
docker compose up --build

# build with version number
VITE_BUILD_VERSION=$(git describe --tags | tr -d '\n') docker compose up --build
```
