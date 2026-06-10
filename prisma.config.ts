import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'
import { resolve } from 'path'

// Prisma CLI doesn't load .env.local — load it explicitly
config({ path: resolve(__dirname, '.env.local') })

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
