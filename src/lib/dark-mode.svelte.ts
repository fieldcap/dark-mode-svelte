import { BROWSER, DEV } from 'esm-env';

/** Represents the possible theme modes */
type ThemeMode = 'light' | 'dark' | undefined;

/**
 * Class to manage dark mode functionality with system preference support.
 * Handles light, dark and system preference modes with local storage persistence.
 */
class DarkMode {
	/** Default theme mode when no user preference or system preference is available */
	#defaultMode: 'light' | 'dark' = 'light';

	/**
	 * @private
	 * @type {ThemeMode}
	 * Stores the user's explicit theme choice.
	 * Undefined means the user hasn't made an explicit choice and use system preference.
	 */
	#modeStore: ThemeMode = $state<ThemeMode>(this.getInitialMode());

	/**
	 * @private
	 * @type {ThemeMode}
	 * Stores the system's color scheme preference.
	 * Updated when the system preference changes.
	 */
	#prefersStore: ThemeMode = $state<ThemeMode>(this.getPrefersMode());

	/**
	 * Initializes a new instance of the DarkMode class.
	 * Sets up system preference listeners and initial DOM state.
	 */
	constructor() {
		this.updateDOM();

		if (this.isBrowser) {
			matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
				this.#prefersStore = e.matches ? 'dark' : 'light';
				this.updateDOM();
			});
		}
	}

	/**
	 * Gets the current active theme mode.
	 * Follows precedence: user preference > system preference > default mode
	 * @returns {'light' | 'dark'} The current active theme mode as light or dark.
	 */
	public get mode(): 'light' | 'dark' {
		return this.#modeStore ?? this.#prefersStore ?? this.#defaultMode;
	}

	/**
	 * Sets the user's theme preference.
	 * @param {ThemeMode} mode - The theme mode to set. undefined means reset to system preference
	 */
	public set mode(mode: ThemeMode) {
		this.#modeStore = mode;
		this.updateDOM();
		this.store();
	}

	/**
	 * Toggles between light and dark mode.
	 * If no explicit mode is set (undefined), uses defaultMode as reference point.
	 */
	public toggle(): void {
		if (this.#modeStore === 'light') {
			this.#modeStore = 'dark';
		} else if (this.#modeStore === 'dark') {
			this.#modeStore = 'light';
		} else if (this.#modeStore === undefined && this.#defaultMode === 'light') {
			this.#modeStore = 'dark';
		}

		this.updateDOM();
		this.store();
	}

	/**
	 * Detects the system's color scheme preference.
	 * @private
	 * @returns {ThemeMode} The system's color scheme preference, or undefined if no preference
	 */
	private getPrefersMode(): ThemeMode {
		if (!this.isBrowser) {
			return undefined;
		}

		if (matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		} else if (matchMedia('(prefers-color-scheme: light)').matches) {
			return 'light';
		}
		return undefined;
	}

	/**
	 * Gets the initial mode when the class is instantiated.
	 * @private
	 * @returns {ThemeMode} The initial theme mode based on localStorage, or undefined if none stored.
	 */
	private getInitialMode(): ThemeMode {
		const saved = this.load();

		if (saved) {
			if (saved === 'light') {
				return 'light';
			}
			if (saved === 'dark') {
				return 'dark';
			}
		}

		return undefined;
	}

	/**
	 * Updates the DOM to reflect the current theme state.
	 * Uses the mode getter which already handles the precedence logic.
	 * @private
	 */
	private updateDOM(): void {
		if (!this.isBrowser) {
			return;
		}

		const isDark = this.mode === 'dark';
		document.documentElement.classList.toggle('dark', isDark);
		document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
	}

	/**
	 * Loads the user's theme preference from localStorage.
	 * @private
	 * @returns {ThemeMode} The stored theme preference, or undefined if none stored.
	 */
	private load(): ThemeMode {
		if (!this.isBrowser) {
			return undefined;
		}

		let localStoreItem = localStorage.getItem('dark-mode');
		if (localStoreItem) {
			localStoreItem = localStoreItem.toLowerCase();
			if (localStoreItem === 'light') {
				return 'light';
			}
			if (localStoreItem === 'dark') {
				return 'dark';
			}
		}
		return undefined;
	}

	/**
	 * Stores the user's theme preference in localStorage.
	 * Removes the stored preference if mode is undefined (system preference).
	 * @private
	 */
	private store(): void {
		if (!this.isBrowser) {
			return;
		}

		if (this.#modeStore === 'light' || this.#modeStore === 'dark') {
			localStorage.setItem('dark-mode', this.#modeStore);
		} else {
			localStorage.removeItem('dark-mode');
		}
	}

	private get isBrowser(): boolean {
		if (DEV) {
			return true;
		}
		return BROWSER;
	}
}

/**
 * Theme management utility for handling light and dark modes.
 * Automatically syncs with system preferences and persists user choices.
 *
 * Handles three levels of theme preference in order of precedence:
 * 1. User's explicit choice (persisted in localStorage)
 * 2. System preference (using prefers-color-scheme media query)
 * 3. Default mode (light)
 *
 * @example
 * // Import the dark mode instance
 * import darkMode from './dark-mode.svelte.js';
 *
 * // Get current theme
 * console.log(darkMode.mode); // 'light' | 'dark'
 *
 * // Set theme explicitly
 * darkMode.mode = 'dark';     // Set to dark mode
 * darkMode.mode = 'light';    // Set to light mode
 * darkMode.mode = undefined;  // Reset to system preference
 *
 * // Toggle between light and dark
 * darkMode.toggle();
 *
 * @property {('light'|'dark')} mode - Get or set the current theme mode
 * @method toggle - Toggles between light and dark mode
 *
 * @example
 * // Usage in a Svelte component
 * <script>
 *   import darkMode from './dark-mode.svelte.js';
 * </script>
 *
 * <button on:click={() => darkMode.toggle()}>
 *   Toggle {darkMode.isDark ? '🌞' : '🌙'}
 * </button>
 */
export default new DarkMode();
