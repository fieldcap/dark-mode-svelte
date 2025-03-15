# Dark Mode Manager for Svelte 5

A simple and efficient dark mode manager for Svelte 5, supporting user preference persistence, system preference detection, and easy toggling.

## Features

- Automatically syncs with system preferences (`prefers-color-scheme`)
- Stores user preference in `localStorage`
- Provides API for getting, setting, and toggling dark mode
- Updates the DOM to apply dark mode via CSS class

## Installation

```bash
npm install dark-mode-svelte
```

## Usage

### Import and Initialize

```svelte
<script>
	import { DarkMode, darkMode } from 'dark-mode-svelte';
</script>
```

### Set the initializer

To prevent flashing from light to dark, place the `<DarkMode />` component as close to your
root component as possible. In Sveltekit this is usually your first `+layout.svelte`.

```svelte
<DarkMode />
```

### Get the Current Theme Mode

```svelte
console.log(darkMode.mode); // 'light' or 'dark'
```

### Set Theme Mode

```svelte
// Explicitly set mode darkMode.mode = 'dark'; // Set to dark mode darkMode.mode = 'light'; // Set
to light mode darkMode.mode = undefined; // Reset to system preference
```

### Toggle Between Light and Dark Mode

```svelte
<button on:click={() => darkMode.toggle()}>
	Toggle {darkMode.mode === 'dark' ? '🌞' : '🌙'}
</button>
```

## How It Works

1. **User Preference**
   - If the user has explicitly set a theme (light/dark), that setting is used in localStorage.
2. **System Preference **
   - If no user preference exists, the system's preference is used.
3. **Default Mode**
   - If neither a user preference nor a system preference exists, the default is `light`.

## API

### `mode: 'light' | 'dark' | undefined`

- **Getter:** Returns the current theme mode (`'light'` or `'dark'`), considering user and system preferences.
- **Setter:** Updates the theme mode. Setting it to `undefined` resets it to follow system preference.

### `toggle(): void`

Toggles between light and dark mode.

## Styling

The component toggles a `dark` class on `document.documentElement`. Use CSS to define dark mode styles:

```css
/* Light Mode */
body {
	background-color: white;
	color: black;
}

/* Dark Mode */
.dark body {
	background-color: black;
	color: white;
}
```

## License

MIT License. Feel free to use and modify it.

## Contributing

Pull requests and improvements are welcome! If you find any issues, feel free to open an issue or create a PR.
