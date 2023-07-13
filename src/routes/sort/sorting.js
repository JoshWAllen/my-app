// @ts-ignore
export function generateInput(amount) {
	const array = [];
	for (let i = 0; i < amount; i += 1) {
		array.push(Math.floor(Math.random() * 1000));
	}
	return array;
}

/* SPLIT INPUT
 * Takes input array arr and splits it into numChunks different chunks */
// @ts-ignore
export function splitInput(arr, numChunks) {
	const chunks = [];
	for (let i = 0; i < numChunks; i += 1) chunks[i] = [];
	for (let i = 0; i < arr.length; i += 1) {
		// @ts-ignore
		chunks[i % numChunks].push(arr[i]);
	}
	return chunks;
}

/* WORK FUNCTION
 * Returns one sorted chunk per slice */
// @ts-ignore
export async function workFn(arr) {
	// @ts-ignore
	progress();
	// @ts-ignore
	return arr.sort((a, b) => a - b);
}

// @ts-ignore
export function chunkSort(arr) {
	const sorted = [];
	while (arr.length) {
		let currentChunk = arr[0];
		let bestChunkIndex = 0;
		let bestValue = currentChunk[0];
		for (let i = 1; i < arr.length; i += 1) {
			currentChunk = arr[i];
			if (currentChunk[0] < bestValue) {
				[bestValue] = currentChunk;
				bestChunkIndex = i;
			}
		}
		sorted.push(arr[bestChunkIndex].shift());
		if (arr[bestChunkIndex].length === 0) arr.splice(bestChunkIndex, 1);
	}
	return sorted;
}
