import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'

export type RobotsPluginOptions = {
  environment?: string | null
  disallowAllContent?: string[]
}

const defaultContent = ['User-agent: *', 'Disallow: /', '']

export const createRobotsTxtPlugin = ({
  environment = process.env.VITE_ENVIRONMENT ?? 'prod',
  disallowAllContent = defaultContent
}: RobotsPluginOptions = {}) => {
  let outDir: string
  let root: string

  const configResolved = (config: ResolvedConfig): void => {
    outDir = config.build.outDir
    root = config.root
  }

  const closeBundle = async (): Promise<void> => {
    if (environment === 'preprod') {
      const robotsPath = resolve(root, outDir, 'robots.txt')

      await writeFile(
        robotsPath,
        disallowAllContent.join('\n'),
        'utf8'
      )
    }
  }

  return {
    name: 'environment-robots',
    apply: 'build',
    configResolved,
    closeBundle
  } satisfies Plugin
}

export default createRobotsTxtPlugin