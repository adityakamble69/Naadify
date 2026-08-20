<script>
	/** @type {string} */
	export let rounded = 'rounded-3xl';
	/** @type {string} */
	export let padding = 'p-6';
	/** @type {string} */
	export let extraClass = '';
</script>

<div class="glass {rounded} {padding} {extraClass}">
	<slot />
</div>
