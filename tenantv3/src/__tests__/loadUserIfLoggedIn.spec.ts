import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadUserIfLoggedIn } from '@/router/loadUserIfLoggedIn'

const { mockKeycloak, mockStore } = vi.hoisted(() => ({
  mockKeycloak: { authenticated: false as boolean | undefined },
  mockStore: {
    user: {} as { id?: number },
    loadUser: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('@/plugin/keycloak', () => ({ keycloak: mockKeycloak }))
vi.mock('@/stores/tenant-store', () => ({ useTenantStore: () => mockStore }))

describe('loadUserIfLoggedIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockKeycloak.authenticated = false
    mockStore.user = {}
  })

  it('loads the tenant when logged in and not loaded yet', async () => {
    mockKeycloak.authenticated = true

    await loadUserIfLoggedIn()

    expect(mockStore.loadUser).toHaveBeenCalledTimes(1)
  })

  it('does not reload a tenant already loaded', async () => {
    mockKeycloak.authenticated = true
    mockStore.user = { id: 42 }

    await loadUserIfLoggedIn()

    expect(mockStore.loadUser).not.toHaveBeenCalled()
  })

  it('does nothing for an anonymous visitor', async () => {
    await loadUserIfLoggedIn()

    expect(mockStore.loadUser).not.toHaveBeenCalled()
  })

  it('lets the page open when loading the tenant fails', async () => {
    mockKeycloak.authenticated = true
    mockStore.loadUser.mockRejectedValueOnce(new Error('network'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(loadUserIfLoggedIn()).resolves.toBeUndefined()
    expect(consoleError).toHaveBeenCalledTimes(1)

    consoleError.mockRestore()
  })
})
