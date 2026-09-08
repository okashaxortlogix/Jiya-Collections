import { test, expect } from '@playwright/test'

test.describe('Jiya AI Stylist Concierge Conversational Tests', () => {
  test('Greets properly when user says "hello" without irrelevant catalog dump', async ({ page }) => {
    await page.goto('/')

    // Open AI Stylist drawer
    const trigger = page.locator('.assistant-trigger-pill')
    await trigger.click()

    const chatPanel = page.locator('.assistant-chat-panel')
    await expect(chatPanel).toBeVisible()

    const input = page.locator('.chat-input-bar input')
    const sendBtn = page.locator('.chat-input-bar button[type="submit"]')

    // 1. Send "hello"
    await input.fill('hello')
    await sendBtn.click()

    // Expect the user message
    await expect(page.locator('.chat-bubble-wrap.user').last()).toContainText('hello')

    // Expect the assistant response to greet politely
    const lastAssistantBubble = page.locator('.chat-bubble-wrap.assistant').last()
    await expect(lastAssistantBubble).toBeVisible({ timeout: 4000 })
    await expect(lastAssistantBubble).toContainText(/Walaikum Assalam|welcome to Jiya Collections/i)
    // Ensure it does NOT dump the old generic paragraph
    await expect(lastAssistantBubble).not.toContainText('offers 35 authentic Pakistani cultural ensembles')

    // 2. Ask about delivery
    await input.fill('delivery kitne din mein hoti hai?')
    await sendBtn.click()

    const deliveryReply = page.locator('.chat-bubble-wrap.assistant').last()
    await expect(deliveryReply).toBeVisible({ timeout: 4000 })
    await expect(deliveryReply).toContainText(/2–4 working days|FREE DELIVERY|Rs\. 8,000/i)

    // 3. Ask about boski fabric
    await input.fill('boski suit dekhna hai')
    await sendBtn.click()

    const boskiReply = page.locator('.chat-bubble-wrap.assistant').last()
    await expect(boskiReply).toBeVisible({ timeout: 4000 })
    await expect(boskiReply).toContainText(/Mughal 6-Pound Luxury Boski|silk/i)
    await expect(boskiReply.locator('.chat-product-card')).toBeVisible()

    // 4. Ask about discount coupon
    await input.fill('koi discount coupon code hai?')
    await sendBtn.click()

    const discountReply = page.locator('.chat-bubble-wrap.assistant').last()
    await expect(discountReply).toBeVisible({ timeout: 4000 })
    await expect(discountReply).toContainText(/EID2026|15% OFF/i)

    // 5. Say thanks
    await input.fill('bohot shukriya!')
    await sendBtn.click()

    const thanksReply = page.locator('.chat-bubble-wrap.assistant').last()
    await expect(thanksReply).toBeVisible({ timeout: 4000 })
    await expect(thanksReply).toContainText(/Aap ka bohot shukriya/i)
  })
})
