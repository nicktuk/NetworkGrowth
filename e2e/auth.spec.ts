import { test, expect } from '@playwright/test'

// Serial: registro crea el usuario que los tests siguientes usan
test.describe.serial('Auth flow', () => {
  const testEmail = `test_${Date.now()}@example.com`
  const testPassword = 'Password123!'
  const testName = 'Test User'

  test.describe('Registro', () => {
    test('usuario nuevo puede registrarse y llega al dashboard', async ({ page }) => {
      await page.goto('/register')
      await page.getByLabel('Nombre').fill(testName)
      await page.getByLabel('Email').fill(testEmail)
      await page.getByLabel('Contraseña').fill(testPassword)
      await page.getByRole('button', { name: 'Crear cuenta gratis' }).click()

      await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
      await expect(page.getByText(testEmail)).toBeVisible()
    })

    test('email duplicado muestra error', async ({ page }) => {
      await page.goto('/register')
      await page.getByLabel('Email').fill(testEmail)
      await page.getByLabel('Contraseña').fill(testPassword)
      await page.getByRole('button', { name: 'Crear cuenta gratis' }).click()

      await expect(page.getByText('Ya existe una cuenta con ese email')).toBeVisible({ timeout: 8000 })
    })

    test('contraseña corta muestra error', async ({ page }) => {
      await page.goto('/register')
      await page.getByLabel('Email').fill(`short_${Date.now()}@example.com`)
      await page.getByLabel('Contraseña').fill('123')
      await page.getByRole('button', { name: 'Crear cuenta gratis' }).click()

      await expect(page.getByText('La contraseña debe tener al menos 8 caracteres')).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('Login', () => {
    test('credenciales correctas redirigen al dashboard', async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill(testEmail)
      await page.getByLabel('Contraseña').fill(testPassword)
      await page.getByRole('button', { name: 'Iniciar sesión' }).click()

      await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
    })

    test('credenciales incorrectas muestran error', async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill(testEmail)
      await page.getByLabel('Contraseña').fill('WrongPassword!')
      await page.getByRole('button', { name: 'Iniciar sesión' }).click()

      await expect(page.getByText('Email o contraseña incorrectos')).toBeVisible({ timeout: 8000 })
    })

    test('acceder a /dashboard sin sesión redirige a /login', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page).toHaveURL(/login/, { timeout: 8000 })
    })
  })

  test.describe('Dashboard y Sign Out', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('Email').fill(testEmail)
      await page.getByLabel('Contraseña').fill(testPassword)
      await page.getByRole('button', { name: 'Iniciar sesión' }).click()
      await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
    })

    test('muestra email del usuario logueado', async ({ page }) => {
      await expect(page.getByText(testEmail)).toBeVisible()
    })

    test('cerrar sesión redirige a /login', async ({ page }) => {
      await page.getByRole('button', { name: 'Cerrar sesión' }).click()
      await expect(page).toHaveURL(/login/, { timeout: 10000 })
    })

    test('después de cerrar sesión, /dashboard redirige a /login', async ({ page }) => {
      await page.getByRole('button', { name: 'Cerrar sesión' }).click()
      await expect(page).toHaveURL(/login/, { timeout: 10000 })
      await page.goto('/dashboard')
      await expect(page).toHaveURL(/login/, { timeout: 8000 })
    })
  })
})
