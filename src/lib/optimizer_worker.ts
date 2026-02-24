import init, { optimize_selection } from 'wasm-optimizer/wasm_optimizer.js';

self.onmessage = async (event) => {
    await init();

    console.log("worker start")
    const { challenges_array, champions_array, limit } = event.data;
    console.log(challenges_array, champions_array, limit)
    
    const result = optimize_selection(challenges_array, champions_array, limit);
    console.log("worker stop")

    self.postMessage(result);
};