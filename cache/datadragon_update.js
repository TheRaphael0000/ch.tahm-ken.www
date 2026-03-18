import { queryFile, versionPath } from './datadragon_utils.js';
import { readFileSync, writeFileSync } from 'fs';

const versionsPath = `datadragon/versions.json`;

const currentVersion = JSON.parse(readFileSync(versionPath));
console.log(`current version: ${currentVersion}`);

await queryFile('api/versions.json', versionsPath);
const versions = JSON.parse(readFileSync(versionsPath));
const version = versions.at(0);
console.log(`latest version: ${version}`);

writeFileSync(versionPath, JSON.stringify(version));
