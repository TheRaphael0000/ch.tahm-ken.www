import init, { optimize_selection } from 'wasm-optimizer/wasm_optimizer.js';

self.onmessage = async (event) => {
	await init();

	const { challenges_array, champions_array, limit } = event.data;

	const result = optimize_selection(challenges_array, champions_array, limit);

	self.postMessage(result);
};
