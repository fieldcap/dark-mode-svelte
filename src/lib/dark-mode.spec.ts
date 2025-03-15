import { describe, it, expect, beforeEach, vi, afterEach, afterAll } from 'vitest';

describe('darkMode', () => {
	let matchMediaMock = new MatchMediaMock();

	beforeEach(() => {
		localStorage.clear();
		vi.resetModules();
		matchMediaMock.clear();
	});

	afterAll(() => {
		matchMediaMock.destroy();
	});

	describe('initial state', () => {
		it('should default to light mode when no preference is set', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			expect(darkMode.mode).toBe('light');
		});

		it('should respect system dark mode preference', async () => {
			matchMediaMock.useMediaQuery('(prefers-color-scheme: dark)');
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			expect(darkMode.mode).toBe('dark');
		});

		it('should respect system light mode preference', async () => {
			matchMediaMock.useMediaQuery('(prefers-color-scheme: light)');
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			expect(darkMode.mode).toBe('light');
		});

		it('should respect stored light preference over system preference', async () => {
			matchMediaMock.useMediaQuery('(prefers-color-scheme: dark)');
			localStorage.setItem('dark-mode', 'light');
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			expect(darkMode.mode).toBe('light');
		});

		it('should respect stored dark preference over system preference', async () => {
			matchMediaMock.useMediaQuery('(prefers-color-scheme: light)');
			localStorage.setItem('dark-mode', 'dark');
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			expect(darkMode.mode).toBe('dark');
		});

		it('should handle invalid localStorage value', async () => {
			localStorage.setItem('dark-mode', 'invalid');
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			expect(darkMode.mode).toBe('light'); // Should fall back to default
		});

		it('should handle empty localStorage value', async () => {
			localStorage.setItem('dark-mode', '');
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			expect(darkMode.mode).toBe('light'); // Should fall back to default
		});

		it('should handle null localStorage value', async () => {
			localStorage.setItem('dark-mode', 'null');
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			expect(darkMode.mode).toBe('light'); // Should fall back to default
		});

		it('should ignore case in localStorage value', async () => {
			localStorage.setItem('dark-mode', 'DARK');
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			expect(darkMode.mode).toBe('dark');
		});
	});

	describe('mode setter', () => {
		it('should set light mode', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			darkMode.mode = 'light';
			expect(darkMode.mode).toBe('light');
			expect(localStorage.getItem('dark-mode')).toBe('light');
		});

		it('should set dark mode', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			darkMode.mode = 'dark';
			expect(darkMode.mode).toBe('dark');
			expect(localStorage.getItem('dark-mode')).toBe('dark');
		});

		it('should reset to system preference when set to undefined', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');

			// First set an explicit mode
			darkMode.mode = 'dark';
			expect(localStorage.getItem('dark-mode')).toBe('dark');

			// Then reset to system preference
			darkMode.mode = undefined;
			expect(localStorage.getItem('dark-mode')).toBeNull();

			// Should now follow system preference
			matchMediaMock.useMediaQuery('(prefers-color-scheme: dark)');
			expect(darkMode.mode).toBe('dark');

			matchMediaMock.useMediaQuery('(prefers-color-scheme: light)');
			expect(darkMode.mode).toBe('light');
		});

		it('should update DOM classes when mode changes', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');

			// Mock classList.toggle
			document.documentElement.classList.toggle = vi.fn();

			darkMode.mode = 'dark';
			expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);

			darkMode.mode = 'light';
			expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
		});

		it('should persist mode changes across instances', async () => {
			const { default: darkMode1 } = await import('./dark-mode.svelte.js');
			darkMode1.mode = 'dark';

			// Get a fresh instance
			vi.resetModules();
			const { default: darkMode2 } = await import('./dark-mode.svelte.js');
			expect(darkMode2.mode).toBe('dark');
		});
	});

	describe('toggle', () => {
		it('should toggle from light to dark', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			darkMode.mode = 'light';
			darkMode.toggle();
			expect(darkMode.mode).toBe('dark');
		});

		it('should toggle from dark to light', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			darkMode.mode = 'dark';
			darkMode.toggle();
			expect(darkMode.mode).toBe('light');
		});

		it('should toggle to the default mode', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			darkMode.toggle();
			expect(darkMode.mode).toBe('dark');
		});

		it('should persist toggled mode to localStorage', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');
			darkMode.mode = 'light';
			darkMode.toggle();
			expect(localStorage.getItem('dark-mode')).toBe('dark');
			darkMode.toggle();
			expect(localStorage.getItem('dark-mode')).toBe('light');
		});

		it('should update DOM classes when toggling', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');

			// Mock classList.toggle
			document.documentElement.classList.toggle = vi.fn();

			darkMode.mode = 'light';
			darkMode.toggle();
			expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);

			darkMode.toggle();
			expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
		});
	});

	describe('DOM updates', () => {
		beforeEach(() => {
			// Mock classList.toggle for each test
			document.documentElement.classList.toggle = vi.fn();
		});

		it('should toggle dark class on document element', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');

			darkMode.mode = 'dark';
			expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);

			darkMode.mode = 'light';
			expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
		});

		it('should update DOM when system preference changes', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');

			// Start with system preference
			darkMode.mode = undefined;
			expect(localStorage.getItem('dark-mode')).toBeNull();

			// Simulate system dark mode preference
			matchMediaMock.useMediaQuery('(prefers-color-scheme: dark)');
			expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);

			// Simulate system light mode preference
			matchMediaMock.useMediaQuery('(prefers-color-scheme: light)');
			expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
		});

		it('should update DOM on initialization', async () => {
			// Set up dark mode preference before module import
			localStorage.setItem('dark-mode', 'dark');
			await import('./dark-mode.svelte.js');
			expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);

			// Reset and test light mode
			vi.resetModules();
			localStorage.setItem('dark-mode', 'light');
			await import('./dark-mode.svelte.js');
			expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
		});
	});

	describe('persistence', () => {
		it('should persist mode changes to localStorage', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');

			// Set dark mode
			darkMode.mode = 'dark';
			expect(localStorage.getItem('dark-mode')).toBe('dark');

			// Set light mode
			darkMode.mode = 'light';
			expect(localStorage.getItem('dark-mode')).toBe('light');

			// Reset to system preference
			darkMode.mode = undefined;
			expect(localStorage.getItem('dark-mode')).toBeNull();
		});

		it('should remove localStorage item when resetting to system preference', async () => {
			const { default: darkMode } = await import('./dark-mode.svelte.js');

			// Set a mode first
			darkMode.mode = 'dark';
			expect(localStorage.getItem('dark-mode')).toBe('dark');

			// Reset to system preference
			darkMode.mode = undefined;

			// Verify localStorage item is completely removed
			expect(localStorage.getItem('dark-mode')).toBeNull();
			expect(Object.keys(localStorage)).not.toContain('dark-mode');
		});

		it('should load persisted mode on initialization', async () => {
			// Set up initial state
			localStorage.setItem('dark-mode', 'dark');
			const { default: darkMode1 } = await import('./dark-mode.svelte.js');
			expect(darkMode1.mode).toBe('dark');

			// Reset modules and test light mode
			vi.resetModules();
			localStorage.setItem('dark-mode', 'light');
			const { default: darkMode2 } = await import('./dark-mode.svelte.js');
			expect(darkMode2.mode).toBe('light');
		});

		it('should handle localStorage clear during runtime', async () => {
			// Set up system preference first
			matchMediaMock.useMediaQuery('(prefers-color-scheme: light)');

			const { default: darkMode } = await import('./dark-mode.svelte.js');

			// Set initial mode
			darkMode.mode = 'dark';
			expect(localStorage.getItem('dark-mode')).toBe('dark');

			// Clear localStorage and force a re-evaluation
			localStorage.clear();
			darkMode.mode = undefined;

			// Should fall back to system preference
			expect(darkMode.mode).toBe('light');
		});
	});
});

interface MediaQueryList {
	readonly matches: boolean;
	readonly media: string;
	onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
	/** @deprecated */
	addListener(callback: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null): void;
	/** @deprecated */
	removeListener(callback: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null): void;
	addEventListener<K extends keyof MediaQueryListEventMap>(
		type: K,
		listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any,
		options?: boolean | AddEventListenerOptions
	): void;
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void;
	removeEventListener<K extends keyof MediaQueryListEventMap>(
		type: K,
		listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any,
		options?: boolean | EventListenerOptions
	): void;
	removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions
	): void;
}

type MediaQueryListener = (this: MediaQueryList, ev: MediaQueryListEvent) => void;

export default class MatchMediaMock {
	private mediaQueries: {
		[key: string]: MediaQueryListener[];
	} = {};

	private mediaQueryList!: MediaQueryList;

	private currentMediaQuery!: string;

	constructor() {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			configurable: true,
			value: (query: string): MediaQueryList => {
				this.mediaQueryList = {
					matches: query === this.currentMediaQuery,
					media: query,
					onchange: null,
					addListener: (listener: MediaQueryListener) => {
						this.addListener(query, listener);
					},
					removeListener: (listener: MediaQueryListener) => {
						this.removeListener(query, listener);
					},
					addEventListener: (type: string, listener: any) => {
						if (type !== 'change') return;

						this.addListener(query, listener);
					},
					removeEventListener: (type: string, listener: any) => {
						if (type !== 'change') return;

						this.removeListener(query, listener);
					}
				};

				return this.mediaQueryList;
			}
		});
	}

	/**
	 * Adds a new listener function for the specified media query
	 * @private
	 */
	private addListener(mediaQuery: string, listener: MediaQueryListener): void {
		if (!this.mediaQueries[mediaQuery]) {
			this.mediaQueries[mediaQuery] = [];
		}

		const query = this.mediaQueries[mediaQuery];
		const listenerIndex = query.indexOf(listener);

		if (listenerIndex !== -1) return;
		query.push(listener);
	}

	/**
	 * Removes a previously added listener function for the specified media query
	 * @private
	 */
	private removeListener(mediaQuery: string, listener: MediaQueryListener): void {
		if (!this.mediaQueries[mediaQuery]) return;

		const query = this.mediaQueries[mediaQuery];
		const listenerIndex = query.indexOf(listener);

		if (listenerIndex === -1) return;
		query.splice(listenerIndex, 1);
	}

	/**
	 * Updates the currently used media query,
	 * and calls previously added listener functions registered for this media query
	 * @public
	 */
	public useMediaQuery(mediaQuery: string): never | void {
		if (typeof mediaQuery !== 'string') throw new Error('Media Query must be a string');

		this.currentMediaQuery = mediaQuery;

		if (!Object.entries(this.mediaQueries).length) return;

		const mqListEvent: Partial<MediaQueryListEvent> = this.mediaQueries[mediaQuery]
			? {
					matches: true,
					media: mediaQuery
				}
			: {
					matches: false,
					media: mediaQuery
				};

		Object.entries(this.mediaQueries).forEach(([_, value]) => {
			value.forEach((listener) => {
				listener.call(this.mediaQueryList, mqListEvent as MediaQueryListEvent);
			});
		});
	}

	/**
	 * Returns an array listing the media queries for which the matchMedia has registered listeners
	 * @public
	 */
	public getMediaQueries(): string[] {
		return Object.keys(this.mediaQueries);
	}

	/**
	 * Returns a copy of the array of listeners for the specified media query
	 * @public
	 */
	public getListeners(mediaQuery: string): MediaQueryListener[] {
		if (!this.mediaQueries[mediaQuery]) return [];
		return this.mediaQueries[mediaQuery].slice();
	}

	/**
	 * Clears all registered media queries and their listeners
	 * @public
	 */
	public clear(): void {
		this.mediaQueries = {};
		this.currentMediaQuery = '';
	}

	/**
	 * Clears all registered media queries and their listeners,
	 * and destroys the implementation of `window.matchMedia`
	 * @public
	 */
	public destroy(): void {
		this.clear();
	}
}
