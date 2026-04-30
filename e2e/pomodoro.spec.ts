import { test, expect } from '@playwright/test'

test('首页显示番茄钟组件', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /tick/i })).toBeVisible()
})

test('tick 按钮切换类型 L -> S', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Type: L')).toBeVisible()
  await page.getByRole('button', { name: /tick/i }).click()
  await expect(page.getByText('Type: S')).toBeVisible()
})

test('设置页显示提示音选项', async ({ page }) => {
  await page.goto('/settings')
  await expect(page.getByText('提示音设置')).toBeVisible()
  await expect(page.getByText('铃声')).toBeVisible()
  await expect(page.getByText('雨林雨声')).toBeVisible()
})

test('进度条行的左右数字与进度条在同一行', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /tick/i }).click()
  // 等待计时器更新，让左右数字都有值
  await page.waitForTimeout(1500)
  const leftCol = page.getByTestId('timer-elapsed')
  const rightCol = page.getByTestId('timer-remaining')
  const leftBox = await leftCol.boundingBox()
  const rightBox = await rightCol.boundingBox()
  expect(leftBox).not.toBeNull()
  expect(rightBox).not.toBeNull()
  // 两列的顶部 Y 坐标相差不超过 10px，说明在同一行
  expect(Math.abs(leftBox!.y - rightBox!.y)).toBeLessThan(10)
})

test('设置页保存提示间隔到 localStorage', async ({ page }) => {
  await page.goto('/settings')
  await page.locator('button:has(.mdi-plus)').click()
  await page.getByRole('button', { name: '保存' }).nth(1).click()
  const value = await page.evaluate(() => localStorage.getItem('pomodoro-ding-interval'))
  expect(Number(value)).toBe(11)
})
