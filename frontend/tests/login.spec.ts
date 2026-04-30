import { test, expect } from '@playwright/test';

test('connexion réussie', async ({ page }) => {
    const email = `leslie_${Date.now()}@test.com`;

    await page.goto('/register');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/login');

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
});

test('connexion échouée', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'faux@test.com');
    await page.fill('input[name="password"]', 'mauvais');
    await page.click('button[type="submit"]');
    await expect(page.locator('p.text-red-400')).toBeVisible();
});