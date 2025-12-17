import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { PluginOption } from 'vite'

export type RobotsPluginOptions = {
  environment?: string | null
  disallowAllContent?: string[]
}

const defaultContent = ['User-agent: *', 'Disallow: /', '']

export const createRobotsTxtPlugin = ({
  // default to prod if not set
  environment = process.env.VITE_ENVIRONMENT ?? 'prod',
  disallowAllContent = defaultContent
}: RobotsPluginOptions = {}): PluginOption => {
  let outDir: string
  let root: string

  return {
    name: 'environment-robots',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
      root = config.root
    },
    async closeBundle() {
      if (environment === 'preprod') {
          // overwrite a disallow-all robots.txt file for non-prod environments
        const robotsPath = resolve(root, outDir, 'robots.txt')

        await writeFile(robotsPath, disallowAllContent.join('\n'), 'utf8')
      }
    }
  }
}

export default createRobotsTxtPlugin

