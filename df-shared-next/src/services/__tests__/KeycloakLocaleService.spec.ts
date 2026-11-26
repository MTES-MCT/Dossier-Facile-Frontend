import { describe, it, expect } from 'vitest'
import { keycloakLocale, withKeycloakLocale } from '../KeycloakLocaleService'

describe('KeycloakLocaleService', () => {
  describe('keycloakLocale', () => {
    it('asks for English when the app is in English', () => {
      expect(keycloakLocale('en')).toBe('en')
    })

    it('asks for nothing when the app is in French, so that Keycloak follows the browser', () => {
      expect(keycloakLocale('fr')).toBeUndefined()
    })
  })

  describe('withKeycloakLocale', () => {
    const registerUrl =
      'https://sso.example/auth/realms/dossier-facile/protocol/openid-connect/registrations?client_id=app&redirect_uri=https%3A%2F%2Fapp.example%2Faccount'

    it('adds the language to an address that already has parameters', () => {
      expect(withKeycloakLocale(registerUrl, 'en')).toBe(`${registerUrl}&ui_locales=en`)
    })

    it('adds the language to an address without parameters', () => {
      expect(withKeycloakLocale('https://sso.example/register', 'en')).toBe(
        'https://sso.example/register?ui_locales=en'
      )
    })

    it('leaves the address as it is when the app is in French', () => {
      expect(withKeycloakLocale(registerUrl, 'fr')).toBe(registerUrl)
    })

    it('leaves a missing address as it is', () => {
      expect(withKeycloakLocale('', 'en')).toBe('')
    })
  })
})
