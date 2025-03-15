<svelte:head>
	<script>
		const stored = localStorage.getItem('dark-mode');
		if (
			stored === 'dark' ||
			(!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		}
	</script>
</svelte:head>
