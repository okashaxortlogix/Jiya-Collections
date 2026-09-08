import { test, expect } from '@playwright/test'

test.describe('Top Navbar & Navigation System', () => {
  test('Storefront Header fits 1366x633 viewport without cut-off or overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 633 })
    await page.goto('/')

    // 1. Announcement Bar
    const announcementBar = page.locator('.announcement-bar')
    await expect(announcementBar).toBeVisible()
    await expect(page.locator('.announcement-ticker-track')).toBeVisible()
    await expect(announcementBar).toContainText('EID2026')

    // 2. Site Header
    const siteHeader = page.locator('.site-header')
    await expect(siteHeader).toBeVisible()

    // Brand Logo
    const brandLogo = page.locator('.brand-logo')
    await expect(brandLogo).toBeVisible()

    // Desktop Primary Nav Links
    const navLinks = page.locator('.desktop-primary-nav .nav-link')
    await expect(navLinks).toHaveCount(6)

    // Desktop Search Bar
    const desktopSearch = page.locator('.desktop-search-wrap')
    await expect(desktopSearch).toBeVisible()

    // Mobile search button should be hidden on desktop
    const mobileSearchBtn = page.locator('.search-mobile-btn')
    await expect(mobileSearchBtn).toBeHidden()

    // Header Utilities
    const wishlistBtn = page.locator('.wishlist-util')
    const accountBtn = page.locator('.account-util')
    const cartBtn = page.locator('.cart-util')

    await expect(wishlistBtn).toBeVisible()
    await expect(accountBtn).toBeVisible()
    await expect(cartBtn).toBeVisible()

    // Verify Cart button is not cut off and fits comfortably within 1366px
    const cartBox = await cartBtn.boundingBox()
    expect(cartBox).not.toBeNull()
    if (cartBox) {
      const cartRightEdge = cartBox.x + cartBox.width
      expect(cartRightEdge).toBeLessThanOrEqual(1366)
      // Ensure at least 10px margin from right edge
      expect(1366 - cartRightEdge).toBeGreaterThanOrEqual(10)
    }
  })

  test('Dedicated Account Page has single clean top bar without duplicate store header', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 633 })
    await page.goto('/')

    // Click on Account button in store header
    const accountBtn = page.locator('.account-util')
    await accountBtn.click()

    // Dedicated Account top bar should be visible
    const accountTopBar = page.locator('.account-top-bar')
    await expect(accountTopBar).toBeVisible()
    await expect(page.locator('.account-back-btn')).toBeVisible()
    await expect(page.locator('.account-top-title')).toContainText('JIYA COLLECTIONS')

    // Main storefront header and announcement bar must NOT be visible on dedicated Account page
    await expect(page.locator('.site-header')).toBeHidden()
    await expect(page.locator('.announcement-bar')).toBeHidden()

    // Click '← Store' back button to return to store
    await page.locator('.account-back-btn').click()

    // Storefront header and announcement bar should be back
    await expect(page.locator('.site-header')).toBeVisible()
    await expect(page.locator('.announcement-bar')).toBeVisible()
    await expect(page.locator('.account-top-bar')).toBeHidden()
  })

  test('Responsive view on tablet/mobile activates mobile toggle and drawer', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    // On 768px, mobile toggle button is visible
    const mobileToggle = page.locator('.mobile-toggle-btn')
    await expect(mobileToggle).toBeVisible()

    // Desktop nav is hidden
    await expect(page.locator('.desktop-primary-nav')).toBeHidden()

    // Mobile search button is visible
    await expect(page.locator('.search-mobile-btn')).toBeVisible()

    // Cart button remains visible
    await expect(page.locator('.cart-util')).toBeVisible()
  })
})
