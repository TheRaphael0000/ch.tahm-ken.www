import cache_discord from './discord.js';
import cache_datadragon from './datadragon.js';

async function main() {
	await cache_discord();
	await cache_datadragon();
}

main();
