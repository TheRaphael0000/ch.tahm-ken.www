import { x } from 'tar';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { mkdirSync } from 'fs';

const endpoint = 'https://ddragon.leagueoflegends.com';

export async function queryFile(pathname, filename) {
	const url = `${endpoint}/${pathname}`;
	console.log(`- query: ${url}`);
	const response = await fetch(url);
	const fileStream = createWriteStream(filename);

	await pipeline(Readable.fromWeb(response.body), fileStream);
}

export async function queryTar(pathname, foldername) {
	const url = `${endpoint}/${pathname}`;
	console.log(`- query: ${url}`);
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Unexpected response ${response.statusText}`);
	mkdirSync(foldername, { recursive: true });
	await pipeline(Readable.fromWeb(response.body), x({ cwd: foldername }));
}
