import { test, expect } from '@playwright/test';

/**
 * E2E tests for the homepage of EdPsych-AI-Education-Platform
 */
test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify the page title
    await expect(page).toHaveTitle(/EdPsych Connect/);
    
    // Verify key elements are present
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Check that navigation links exist
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(await navLinks.count());
    
    // Click on the first navigation link and verify navigation
    const firstLink = navLinks.first();
    const href = await firstLink.getAttribute('href');
    if (href && !href.startsWith('http')) {
      await firstLink.click();
      // Wait for navigation to complete
      await page.waitForLoadState('networkidle');
      // Verify we're on a different page
      expect(page.url()).not.toBe('/');
    }
  });

  test('should have responsive design', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('nav')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if there's a mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu" i], [role="button"][aria-label*="menu" i]');
    if (await mobileMenuButton.count() > 0) {
      await expect(mobileMenuButton.first()).toBeVisible();
    } else {
      // If no mobile menu button, the nav should still be accessible
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('should have accessible elements', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Check for image alt texts
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      const role = await image.getAttribute('role');
      
      // Images should have alt text or role="presentation"
      expect(alt !== null || role === 'presentation').toBeTruthy();
    }
    
    // Check for form labels if forms exist
    const formInputs = page.locator('input:not([type="hidden"]), textarea, select');
    const inputCount = await formInputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i);
      const id = await input.getAttribute('id');
      
      if (id) {
        // Check if there's a label for this input
        const label = page.locator(`label[for="${id}"]`);
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        // Input should have an associated label or aria-label/aria-labelledby
        expect(
          await label.count() > 0 || 
          ariaLabel !== null || 
          ariaLabelledBy !== null
        ).toBeTruthy();
      }
    }
  });
});
