import { expect, test } from '@playwright/test'

async function login(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/login')
  await page.getByPlaceholder('请输入用户名').fill('admin')
  await page.getByPlaceholder('请输入密码').fill('123456')
  await page.getByRole('button', { name: '登录' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

test.describe('鉴权', () => {
  test('未登录访问首页会重定向到登录页', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('使用 Mock 账号登录后进入工作台', async ({ page }) => {
    await login(page)
    await expect(page.getByText('工作台').first()).toBeVisible()
  })

  test('登录后进入用户管理可看到列表数据', async ({ page }) => {
    await login(page)
    await page.goto('/system/user')

    await expect(page.getByText('用户列表')).toBeVisible()
    await expect(page.locator('.el-table__row').first()).toBeVisible()
  })
})
