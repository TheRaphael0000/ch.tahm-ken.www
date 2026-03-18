import { readFileSync, existsSync, mkdirSync, rmSync, cpSync } from 'fs';
import { queryTar } from './datadragon_utils.js';

console.log('Caching datadragon...');

try {
	mkdirSync('datadragon', { recursive: true });
} catch {
	//
}

const versionPath = `datadragon/version.json`;
const version = JSON.parse(readFileSync(versionPath));

const dragontailPath = `datadragon/dragontail-${version}`;

if (existsSync(dragontailPath)) {
	console.log(`${dragontailPath} already on disk!`);
} else {
	console.log(`downloading datadragon version ${version}`);
	await queryTar(`cdn/dragontail-${version}.tgz`, dragontailPath);
}

// clean
console.log(`clearing datadragon files`);
try {
	rmSync(`src/data/cache/datadragon`, { recursive: true });
} catch {
	//
}
try {
	rmSync(`static/img/cache/datadragon`, { recursive: true });
} catch {
	//
}

mkdirSync(`src/data/cache/datadragon`, { recursive: true });
mkdirSync(`static/img/cache/datadragon`, { recursive: true });

// copies
console.log(`copying datadragon files`);

/// data
cpSync(
	`${dragontailPath}/${version}/data/en_US/champion.json`,
	`src/data/cache/datadragon/champion.json`
);
cpSync(`${dragontailPath}/${version}/manifest.json`, `src/data/cache/datadragon/manifest.json`);

/// static
cpSync(`${dragontailPath}/${version}/img/champion`, `static/img/cache/datadragon/champion`, {
	recursive: true
});
cpSync(`${dragontailPath}/${version}/img/profileicon`, `static/img/cache/datadragon/profileicon`, {
	recursive: true
});
cpSync(`${dragontailPath}/img/challenges-images`, `static/img/cache/datadragon/challenges-images`, {
	recursive: true
});
cpSync(`${dragontailPath}/img/champion/splash`, `static/img/cache/datadragon/splash`, {
	recursive: true
});
