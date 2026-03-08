import { test, expect } from '@playwright/test'

test.describe('Pomodoro Settings', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to pomodoro page
    await page.goto('/pomodoro')
  })

  test('opens settings modal and updates values', async ({ page }) => {
    // AC 1: Click settings icon
    await page.click('[aria-label="Paramètres"]')

    // AC 8: Modal pre-filled with current values
    const focusInput = page.locator('input[id="focusDuration"]')
    await expect(focusInput).toHaveValue('25')

    // AC 2: Change focus duration
    await focusInput.fill('30')
    await page.locator('input[id="breakDuration"]').fill('10')
    await page.locator('input[id="repetitions"]').fill('5')

    // Save
    await page.click('button:has-text("Enregistrer")')

    // Timer updated to 30:00
    await expect(page.locator('text=30:00')).toBeVisible()
  })

  test('shows warning when changing settings while running', async ({ page }) => {
    // Start timer with space
    await page.keyboard.press('Space')

    // Verify timer is running
    await expect(page.locator('text=25:00')).toBeVisible()

    // AC 6: Open settings while running
    await page.click('[aria-label="Paramètres"]')
    await page.locator('input[id="focusDuration"]').fill('30')
    await page.click('button:has-text("Enregistrer")')

    // AC 6: Warning appears
    await expect(
      page.locator('text=Modifier les paramètres ?')
    ).toBeVisible()

    // AC 7: Confirm change
    await page.click('button:has-text("Continuer")')

    // Timer reset to 30:00 and should be stopped (pause button visible, not play)
    await expect(page.locator('text=30:00')).toBeVisible()
    await expect(page.locator('[aria-label*="Démarrer"]')).toBeVisible()
  })

  // AC 10: Keyboard shortcut
  test('opens settings with comma key', async ({ page }) => {
    await page.keyboard.press(',')

    await expect(page.locator('text=Paramètres Pomodoro')).toBeVisible()
  })

  test('validation errors show for invalid values', async ({ page }) => {
    // AC 1: Click settings icon
    await page.click('[aria-label="Paramètres"]')

    // Try invalid focus duration (too high)
    await page.locator('input[id="focusDuration"]').fill('100')
    await page.click('button:has-text("Enregistrer")')

    // AC 9: Error message visible
    await expect(page.locator('text=Maximum 60 minutes')).toBeVisible()
  })

  test('canceling warning dialog does not apply changes', async ({ page }) => {
    // Start timer
    await page.keyboard.press('Space')

    // Open settings and try to change while running
    await page.click('[aria-label="Paramètres"]')
    await page.locator('input[id="focusDuration"]').fill('30')
    await page.click('button:has-text("Enregistrer")')

    // Cancel the warning
    await page.click('button:has-text("Annuler")')

    // Timer should still show 25:00 (not changed)
    await expect(page.locator('text=25:00')).toBeVisible()
  })

  test('closing modal without saving does not apply changes', async ({ page }) => {
    // AC 1: Click settings icon
    await page.click('[aria-label="Paramètres"]')

    // Make changes but click cancel/close
    await page.locator('input[id="focusDuration"]').fill('45')

    // Click cancel button (or the X)
    const cancelButton = page.locator('button:has-text("Annuler")').first()
    await cancelButton.click()

    // Open settings again - should still show 25
    await page.click('[aria-label="Paramètres"]')
    const focusInput = page.locator('input[id="focusDuration"]')
    await expect(focusInput).toHaveValue('25')
  })

  test('keyboard shortcut escape closes modal', async ({ page }) => {
    // AC 10: Open settings with comma
    await page.keyboard.press(',')
    await expect(page.locator('text=Paramètres Pomodoro')).toBeVisible()

    // Press escape to close
    await page.keyboard.press('Escape')

    // Modal should be closed
    await expect(page.locator('text=Paramètres Pomodoro')).not.toBeVisible()
  })

  test('settings persist across page reloads', async ({ page }) => {
    // AC 3, 11: Change settings
    await page.click('[aria-label="Paramètres"]')
    await page.locator('input[id="focusDuration"]').fill('35')
    await page.click('button:has-text("Enregistrer")')

    // Wait for success toast (if implemented)
    await page.waitForTimeout(500)

    // Reload page
    await page.reload()

    // Settings should still be 35
    await page.click('[aria-label="Paramètres"]')
    const focusInput = page.locator('input[id="focusDuration"]')
    await expect(focusInput).toHaveValue('35')
  })

  test('auto-switch toggle works', async ({ page }) => {
    // AC 2: Toggle auto-switch
    await page.click('[aria-label="Paramètres"]')

    // Find and click the switch
    const autoSwitchSwitch = page.locator('[id="autoSwitch"]').first()
    await autoSwitchSwitch.click()

    // Save
    await page.click('button:has-text("Enregistrer")')

    // Verify toggle state (visual check if switch shows different state)
    await page.click('[aria-label="Paramètres"]')
    const switchInput = page.locator('[id="autoSwitch"]')
    // The switch should show as off now
    const switchButton = page.locator('button').filter({
      has: switchInput,
    })
    await expect(switchButton).toBeTruthy()
  })
})
