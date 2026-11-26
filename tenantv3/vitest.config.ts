import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      root: fileURLToPath(new URL('./', import.meta.url)),
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            setupFiles: ['tests/unit.setup.ts'],
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'e2e/*', '**/*.browser.spec.ts']
          }
        },
        {
          extends: true,
          test: {
            name: 'component',
            include: ['src/**/*.browser.spec.ts'],
            setupFiles: ['tests/component.setup.ts'],
            browser: {
              enabled: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }]
            }
          }
        }
      ]
    }
  })
)
