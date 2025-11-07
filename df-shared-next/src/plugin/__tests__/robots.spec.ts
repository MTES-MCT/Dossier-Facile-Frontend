import { access, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { afterEach, describe, expect, it } from 'vitest'

import { createRobotsTxtPlugin } from '../robots'

const OUT_DIR = 'dist'

const tempRoots: string[] = []

const setupPlugin = async (options?: Parameters<typeof createRobotsTxtPlugin>[0]) => {
  const root = await mkdtemp(join(tmpdir(), 'robots-plugin-'))
  tempRoots.push(root)

  await mkdir(join(root, OUT_DIR), { recursive: true })

  const plugin = createRobotsTxtPlugin(options)

  plugin.configResolved?.({
    root,
    build: { outDir: OUT_DIR }
  } as any)

  return { plugin, root }
}

const resolveRobotsPath = (root: string) => join(root, OUT_DIR, 'robots.txt')

afterEach(async () => {
  while (tempRoots.length) {
    const dir = tempRoots.pop()
    if (!dir) {
      continue
    }

    await rm(dir, { recursive: true, force: true })
  }
})

describe('createRobotsTxtPlugin', () => {
  it('writes the provided disallow-all content when environment is preprod', async () => {
    const disallowAllContent = ['User-agent: *', 'Disallow: /test', '']
    const { plugin, root } = await setupPlugin({
      environment: 'preprod',
      disallowAllContent
    })

    await plugin.closeBundle?.()

    const content = await readFile(resolveRobotsPath(root), 'utf8')

    expect(content).toBe(disallowAllContent.join('\n'))
  })

  it('falls back to do not write a robots file', async () => {
    const { plugin, root } = await setupPlugin({ environment: 'dev' })

    await plugin.closeBundle?.()

    await expect(access(resolveRobotsPath(root))).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('does not write a robots file in prod', async () => {
    const { plugin, root } = await setupPlugin({ environment: 'prod' })

    await plugin.closeBundle?.()

    await expect(access(resolveRobotsPath(root))).rejects.toMatchObject({ code: 'ENOENT' })
  })
})


