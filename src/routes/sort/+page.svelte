<script>
	// @ts-nocheck

	// @ts-ignore
	import { generateInput, splitInput, workFn, chunkSort } from './sorting';
	import { Input } from '$components/ui/input';
	import Button from '$components/ui/button/Button.svelte';

	let total = 6;
	let chunks = 2;
	let jobAccepted = false;
	let results = [];
	let sortedSet = [];
	/**
	 * @type {any[]}
	 */
	let sourceSet = [];
	/**
	 * @type {any[]}
	 */
	let inputSet = [];

	async function deploy() {
		// @ts-ignore
		const { compute } = dcp;

		sourceSet = generateInput(total);
		console.log('sourceSet: ', sourceSet);
		inputSet = splitInput(sourceSet, chunks);
		console.log('inputSet: ', inputSet);

		/* COMPUTE FOR */
		// @ts-ignore
		const job = compute.for(inputSet, workFn);
		job.public.name = 'dcp-sort - Web';
		// job.computeGroups = [{ joinKey: 'Your Key', joinSecret: 'Your Secret' }];

		// Not mandatory console logs for status updates
		job.on('accepted', () => {
			jobAccepted = true;
			console.log(` - Job accepted with id: ${job.id}`);
		});
		job.on('result', (/** @type {any} */ ev) => {
			results = [...results, Array.from(ev.result)];
			console.log(` - Received result ${JSON.stringify(ev)}`);
		});

		/* PROCESS RESULTS */
		let resultSet = await job.exec();
		resultSet = Array.from(resultSet);

		// @ts-ignore
		sortedSet = chunkSort(resultSet);
		console.log('Sorted Set: ', sortedSet);
		console.log(' - Job Complete');
	}
</script>

<svelte:head>
	<script src="https://scheduler.distributed.computer/dcp-client/dcp-client.js"></script>
</svelte:head>
<h1
	class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
>
	DCP Sorting Demo
</h1>
<div class="w-1/2 m-auto text-left">
	<p>Numbers: <Input type="number" id="input-total" bind:value={total} /></p>
	<p>Chunks: <Input type="number" id="input-chunks" bind:value={chunks} /></p>
	<p class="my-1">Let's generate {total} random numbers and sort them in {chunks} chunks</p>
	<Button on:click={deploy}>Deploy</Button>

	{#if sourceSet.length !== 0}
		<h2 class="text-2xl font-bold">Step 1: Generate a List of Numbers to Sort</h2>
		<p>{sourceSet}</p>
	{/if}

	{#if inputSet.length !== 0}
		<h2 class="text-2xl font-bold">Step 2: Separate List into Chunks</h2>
		{#each inputSet as item}
			<p>{item}</p>
		{/each}
	{/if}

	{#if jobAccepted === true}
		<h2 class="text-2xl font-bold">Step 3: Send Slices to DCP and Wait for Results...</h2>
	{/if}
	{#each results as result}
		<p>{result}</p>
	{/each}

	{#if sortedSet.length !== 0}
		<h2 class="text-2xl font-bold">Step 4: Take Slice Results and Sort Globally</h2>
		<p>{sortedSet}</p>
	{/if}
</div>
