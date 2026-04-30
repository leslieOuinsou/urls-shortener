import { test, expect } from '@playwright/test';

test('créer un lien court sans compte', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="url"]', 'https://google.com');
    await page.click('button[type="submit"]');
    await expect(page.locator('a.font-mono')).toBeVisible();
});

test('créer un lien avec code personnalisé', async ({ page }) => {
    const code = `tc${Date.now()}`.slice(0, 8);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const urlInput = page.locator('input[name="url"]');
    await urlInput.scrollIntoViewIfNeeded();
    await urlInput.click();
    await urlInput.fill('https://google.com');

    const codeInput = page.locator('input[name="customCode"]');
    await codeInput.click();
    await codeInput.fill(code);

    console.log('url:', await urlInput.inputValue());
    console.log('code:', await codeInput.inputValue());

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/debug-shortener.png' });

    await expect(page.locator('a.font-mono')).toContainText(code);
});

test('redirection du lien court', async ({ page }) => {
    await page.goto('/moncode');
    await expect(page).toHaveURL(/google\.com/);
});