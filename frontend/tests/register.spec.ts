import { test, expect } from '@playwright/test';

test('inscription réussie', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Leslie Test');
    await page.fill('input[name="email"]', `test_${Date.now()}@test.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/login');
});

test('inscription avec email déjà utilisé', async ({ page }) => {
    const email = `doublon_${Date.now()}@test.com`;

    await page.goto('/register');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/login');

    await page.goto('/register');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('p.text-red-400')).toBeVisible();
});