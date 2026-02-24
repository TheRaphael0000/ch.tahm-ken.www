import { readFileSync, existsSync, mkdirSync, rmSync, cpSync } from 'fs';
import { x } from 'tar';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

const endpoint = 'https://ddragon.leagueoflegends.com';

async function queryFile(pathname, filename) {
	const url = `${endpoint}/${pathname}`;
	console.log(`- query: ${url}`);
	const response = await fetch(url);
	const fileStream = createWriteStream(filename);

	await pipeline(Readable.fromWeb(response.body), fileStream);
}

async function queryTar(pathname, foldername) {
	const url = `${endpoint}/${pathname}`;
	console.log(`- query: ${url}`);
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Unexpected response ${response.statusText}`);
	mkdirSync(foldername, { recursive: true });
	await pipeline(Readable.fromWeb(response.body), x({ cwd: foldername }));
}

export default async function main() {
	console.log('Caching datadragon...');

	try {
		mkdirSync('datadragon', { recursive: true });
	} catch {
		//
	}

	const versionPath = `datadragon/versions.json`;
	await queryFile('api/versions.json', versionPath);
	const versions = JSON.parse(readFileSync(versionPath));

	const version = versions.at(0);
	console.log(`latest version: ${version}`);

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
	cpSync(
		`${dragontailPath}/${version}/img/profileicon`,
		`static/img/cache/datadragon/profileicon`,
		{ recursive: true }
	);
	cpSync(
		`${dragontailPath}/img/challenges-images`,
		`static/img/cache/datadragon/challenges-images`,
		{ recursive: true }
	);
	cpSync(`${dragontailPath}/img/champion/splash`, `static/img/cache/datadragon/splash`, {
		recursive: true
	});
}
