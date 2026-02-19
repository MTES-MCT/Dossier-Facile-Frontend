import { UtilsService } from '../services/UtilsService'
import { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { describe, it, expect } from 'vitest'

describe('UtilsService', () => {
  describe('tenantFullName', () => {
    it.each([
      {
        user: { firstName: 'john', lastName: 'doe', email: 'john.doe@example.com' },
        expected: 'John\xa0Doe'
      },
      {
        user: {
          firstName: 'john',
          lastName: 'doe',
          preferredName: 'smith',
          email: 'john.doe@example.com'
        },
        expected: 'John\xa0Smith'
      },
      {
        user: {
          firstName: 'jean-pierre',
          lastName: 'de la fontaine',
          email: 'jp@example.com'
        },
        expected: 'Jean-Pierre\xa0De La Fontaine'
      },
      {
        user: {
          firstName: 'john',
          lastName: 'doe',
          preferredName: '',
          email: 'john.doe@example.com'
        },
        expected: 'John\xa0Doe'
      },
      {
        user: {
          firstName: 'John',
          lastName: 'John',
          email: 'john@example.com'
        },
        expected: 'John\xa0John'
      },
      {
        user: {
          firstName: 'John',
          lastName: 'poeut',
          preferredName: 'John',
          email: 'john@example.com'
        },
        expected: 'John\xa0John'
      },
      {
        user: { email: 'test@test.com' },
        expected: 'test@test.com'
      }
    ])('should return $expected for $user', ({ user, expected }) => {
      const result = UtilsService.tenantFullName(user as CoTenant)
      expect(result).toBe(expected)
    })
  })
})
