import { test, expect } from '@playwright/test'

test('home page shows pomodoro component', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /next/i })).toBeVisible()
})

test('Next button switches type from Focus to Break', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Focus')).toBeVisible()
  await page.getByRole('button', { name: /next/i }).click()
  await expect(page.getByText('Break')).toBeVisible()
})

test('settings page shows alert sound options', async ({ page }) => {
  await page.goto('/settings')
  await expect(page.getByText('Alert Sound', { exact: true })).toBeVisible()
  await expect(page.getByText('Bell')).toBeVisible()
  await expect(page.getByText('Rain Forest')).toBeVisible()
})

test('left and right numbers align with the progress bar on the same row', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /next/i }).click()
  await page.waitForTimeout(1500)
  const leftCol = page.getByTestId('timer-elapsed')
  const rightCol = page.getByTestId('timer-remaining')
  const leftBox = await leftCol.boundingBox()
  const rightBox = await rightCol.boundingBox()
  expect(leftBox).not.toBeNull()
  expect(rightBox).not.toBeNull()
  // top Y coordinates differ by less than 10px, confirming they are on the same row
  expect(Math.abs(leftBox!.y - rightBox!.y)).toBeLessThan(10)
})

test('settings page saves ding interval to localStorage', async ({ page }) => {
  await page.goto('/settings')
  await page.locator('button:has(.mdi-plus)').click()
  await page.getByRole('button', { name: 'Save' }).nth(1).click()
  const value = await page.evaluate(() => localStorage.getItem('pomodoro-ding-interval'))
  expect(Number(value)).toBe(11)
})

test('right number does not overflow viewport when sidebar is open', async ({ page }) => {
  await page.goto('/')
  // open sidebar
  await page.getByTestId('nav-toggle').click()
  await page.waitForTimeout(400) // wait for drawer animation to finish

  const rightCol = page.getByTestId('timer-remaining')
  const rightBox = await rightCol.boundingBox()
  expect(rightBox).not.toBeNull()

  const viewportWidth = page.viewportSize()!.width
  expect(rightBox!.x + rightBox!.width).toBeLessThanOrEqual(viewportWidth)
})

test('active Pomodoro nav item background is not dark', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('nav-toggle').click()
  await page.waitForTimeout(400)

  const activeItem = page.getByRole('link', { name: /pomodoro/i })
  const imgBuffer = await activeItem.screenshot({ path: 'test-results/active-item-debug.png' })

  // decode screenshot with canvas in page context and calculate average brightness
  const avgBrightness = await page.evaluate(async (base64) => {
    return new Promise<number>((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        const data = ctx.getImageData(0, 0, img.width, img.height).data
        let total = 0
        for (let i = 0; i < data.length; i += 4) {
          total += (data[i] + data[i + 1] + data[i + 2]) / 3
        }
        resolve(total / (data.length / 4))
      }
      img.src = `data:image/png;base64,${base64}`
    })
  }, imgBuffer.toString('base64'))

  // dark background brightness is near 0, light/tonal background brightness > 100 (max 255)
  expect(avgBrightness).toBeGreaterThan(100)
})

test('timer block is vertically centered in the viewport', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('[data-testid="timer-elapsed"]')

  const viewport = page.viewportSize()!
  // app-bar (64px) and footer (32px) define the usable area
  const usableTop = 64
  const usableBottom = viewport.height - 32
  const usableMidY = (usableTop + usableBottom) / 2

  // use the progress bar row as the center reference of the timer block
  const elapsed = page.getByTestId('timer-elapsed')
  const remaining = page.getByTestId('timer-remaining')
  const elapsedBox = await elapsed.boundingBox()
  const remainingBox = await remaining.boundingBox()
  expect(elapsedBox).not.toBeNull()
  expect(remainingBox).not.toBeNull()

  const timerRowMidY = elapsedBox!.y + elapsedBox!.height / 2

  // the timer row mid-point should be within 60px of the usable area center
  // (60px tolerance accounts for the title and start-time text above the row)
  expect(Math.abs(timerRowMidY - usableMidY)).toBeLessThan(60)

  // the timer block should be horizontally centered:
  // elapsed (left edge) and remaining (right edge) should be roughly symmetric around viewport center
  const viewportMidX = viewport.width / 2
  const blockLeft = elapsedBox!.x
  const blockRight = remainingBox!.x + remainingBox!.width
  const blockMidX = (blockLeft + blockRight) / 2
  expect(Math.abs(blockMidX - viewportMidX)).toBeLessThan(40)
})
