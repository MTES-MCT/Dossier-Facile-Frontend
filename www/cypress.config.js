import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: "http://localhost:9001",
  },
  hosts: { localhost: '127.0.0.1' }
})
