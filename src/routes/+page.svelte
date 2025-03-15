<script lang="ts">
	import DarkMode from '$lib/DarkMode.svelte';
	import darkMode from '../lib/dark-mode.svelte.js';
</script>

<DarkMode />

<button data-testid="toggle-mode" onclick={() => darkMode.toggle()}>Toggle</button>
<button data-testid="light-mode" onclick={() => (darkMode.mode = 'light')}>Light</button>
<button data-testid="dark-mode" onclick={() => (darkMode.mode = 'dark')}>Dark</button>
<button data-testid="system-mode" onclick={() => (darkMode.mode = undefined)}>System</button>
<div data-testid="mode-display">Mode={darkMode.mode}</div>
