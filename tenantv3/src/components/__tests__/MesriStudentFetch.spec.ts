import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { AxiosError, AxiosHeaders } from 'axios'
import MesriStudentFetch from '../mainActivity/lib/MesriStudentFetch.vue'

const { loginMock, replaceMock, fetchMock, loadUserCommitMock, storeState, routeState } =
  vi.hoisted(() => ({
    loginMock: vi.fn(),
    replaceMock: vi.fn(),
    fetchMock: vi.fn(),
    loadUserCommitMock: vi.fn(),
    storeState: { user: { mesriStudentEligible: true } },
    routeState: { path: '/etudes', query: {} as Record<string, string> }
  }))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('vue-router', () => ({
  useRoute: () => routeState,
  useRouter: () => ({ replace: replaceMock })
}))

vi.mock('@/plugin/keycloak', () => ({
  keycloak: { login: loginMock }
}))

vi.mock('@/services/RegisterService', () => ({
  RegisterService: { fetchMesriStudentStatus: fetchMock }
}))

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    user: storeState.user,
    loadUserCommit: loadUserCommitMock
  })
}))

function axiosError(status: number) {
  const headers = new AxiosHeaders()
  return new AxiosError('error', 'ERR', { headers }, null, {
    status,
    statusText: '',
    headers,
    config: { headers },
    data: {}
  })
}

function mountComponent() {
  return mount(MesriStudentFetch, {
    global: {
      stubs: {
        DsfrAlert: {
          template: '<div class="alert">{{ description }}</div>',
          props: ['description']
        }
      }
    }
  })
}

describe('MesriStudentFetch', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_FULL_TENANT_URL', 'http://localhost:9002')
    storeState.user.mesriStudentEligible = true
    routeState.query = {}
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('shows the callout when the API says the tenant is eligible', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[data-testid="mesri-student-fetch"]').exists()).toBe(true)
  })

  it('hides the callout when the API says the tenant is not eligible or does not say', () => {
    storeState.user.mesriStudentEligible = false
    expect(mountComponent().find('[data-testid="mesri-student-fetch"]').exists()).toBe(false)

    storeState.user.mesriStudentEligible = undefined
    expect(mountComponent().find('[data-testid="mesri-student-fetch"]').exists()).toBe(false)
  })

  it('re-logs through FranceConnect with the mesri flag in the redirect URI', async () => {
    const wrapper = mountComponent()
    await wrapper.find('[data-testid="mesri-button"]').trigger('click')
    expect(loginMock).toHaveBeenCalledWith({
      idpHint: 'oidc',
      prompt: 'login',
      redirectUri: 'http://localhost:9002/etudes?mesri=1'
    })
  })

  it('fetches the status on return from FranceConnect, commits the user and strips the flag', async () => {
    routeState.query = { mesri: '1', other: 'x' }
    const user = { id: 42 }
    fetchMock.mockResolvedValue({ data: user })

    const wrapper = mountComponent()
    await flushPromises()

    expect(replaceMock).toHaveBeenCalledWith({ path: '/etudes', query: { other: 'x' } })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(loadUserCommitMock).toHaveBeenCalledWith(user)
    expect(wrapper.find('[data-testid="mesri-success"]').exists()).toBe(true)
  })

  it('does nothing on mount without the flag', async () => {
    mountComponent()
    await flushPromises()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(replaceMock).not.toHaveBeenCalled()
  })

  it.each([
    [404, 'errors.not-found'],
    [409, 'errors.token-expired'],
    [422, 'errors.no-admission'],
    [403, 'errors.not-eligible'],
    [500, 'errors.generic']
  ])('maps HTTP %i to the %s message', async (status, message) => {
    routeState.query = { mesri: '1' }
    fetchMock.mockRejectedValue(axiosError(status))

    const wrapper = mountComponent()
    await flushPromises()

    const alert = wrapper.find('[data-testid="mesri-error"]')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toBe(message)
    expect(loadUserCommitMock).not.toHaveBeenCalled()
  })

  it('offers a retry label after an expired token', async () => {
    routeState.query = { mesri: '1' }
    fetchMock.mockRejectedValue(axiosError(409))

    const wrapper = mountComponent()
    await flushPromises()

    expect(wrapper.find('[data-testid="mesri-button"]').text()).toBe('retry')
  })
})
