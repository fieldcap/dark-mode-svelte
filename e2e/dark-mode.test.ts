import { expect, test } from '@playwright/test';

test.describe('Dark Mode', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should start with light mode', async ({ page }) => {
		await expect(page.getByTestId('mode-display')).toHaveText('Mode=light');
		await expect(page.locator('html')).not.toHaveClass(/dark/);
	});

	test('should toggle between modes', async ({ page }) => {
		const toggle = page.getByTestId('toggle-mode');
		const modeDisplay = page.getByTestId('mode-display');

		// Toggle to dark
		await toggle.click();
		await expect(modeDisplay).toHaveText('Mode=dark');
		await expect(page.locator('html')).toHaveClass(/dark/);

		// Toggle back to light
		await toggle.click();
		await expect(modeDisplay).toHaveText('Mode=light');
		await expect(page.locator('html')).not.toHaveClass(/dark/);
	});

	test('should set explicit modes', async ({ page }) => {
		const modeDisplay = page.getByTestId('mode-display');

		// Set dark mode
		await page.getByTestId('dark-mode').click();
		await expect(modeDisplay).toHaveText('Mode=dark');
		await expect(page.locator('html')).toHaveClass(/dark/);

		// Set light mode
		await page.getByTestId('light-mode').click();
		await expect(modeDisplay).toHaveText('Mode=light');
		await expect(page.locator('html')).not.toHaveClass(/dark/);
	});

	test('should remember preference across reloads', async ({ page }) => {
		const modeDisplay = page.getByTestId('mode-display');

		// Set dark mode
		await page.getByTestId('dark-mode').click();
		await expect(modeDisplay).toHaveText('Mode=dark');

		// Reload page
		await page.reload();

		// Verify preference persisted
		await expect(modeDisplay).toHaveText('Mode=dark');
		await expect(page.locator('html')).toHaveClass(/dark/);
	});

	test('should respect system preference', async ({ page }) => {
		const modeDisplay = page.getByTestId('mode-display');

		// Set to system preference
		await page.getByTestId('system-mode').click();

		// Test dark scheme
		await page.emulateMedia({ colorScheme: 'dark' });
		await expect(modeDisplay).toHaveText('Mode=dark');
		await expect(page.locator('html')).toHaveClass(/dark/);

		// Test light scheme
		await page.emulateMedia({ colorScheme: 'light' });
		await expect(modeDisplay).toHaveText('Mode=light');
		await expect(page.locator('html')).not.toHaveClass(/dark/);
	});

	test('should handle system preference changes', async ({ page }) => {
		const modeDisplay = page.getByTestId('mode-display');

		// Start with system preference
		await page.getByTestId('system-mode').click();

		// Change system preference multiple times
		await page.emulateMedia({ colorScheme: 'dark' });
		await expect(modeDisplay).toHaveText('Mode=dark');

		await page.emulateMedia({ colorScheme: 'light' });
		await expect(modeDisplay).toHaveText('Mode=light');

		await page.emulateMedia({ colorScheme: 'dark' });
		await expect(modeDisplay).toHaveText('Mode=dark');
	});

	test('should set the colorScheme style', async ({ page }) => {
		const getColorStyle = async () => {
			const element = await page.locator('html');
			return await element.evaluate((el) => {
				return window.getComputedStyle(el).getPropertyValue('color-scheme');
			});
		};

		let colorScheme = await getColorStyle();
		expect(colorScheme).toBe('light');

		// Set dark mode
		await page.getByTestId('dark-mode').click();
		colorScheme = await getColorStyle();
		expect(colorScheme).toBe('dark');

		// Set light mode
		await page.getByTestId('light-mode').click();
		colorScheme = await getColorStyle();
		expect(colorScheme).toBe('light');
	});
});
