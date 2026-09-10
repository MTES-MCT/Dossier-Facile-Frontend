import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ProfessionalAnalysisErrorStrategy } from '../analysis/strategies/ProfessionalAnalysisErrorStrategy'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { AnalyticsService } from '@/services/AnalyticsService'

dayjs.locale('fr')

describe('ProfessionalAnalysisErrorStrategy', () => {
  const t = (key: string, params?: Record<string, any>) => {
    if (key === 'professional-errors.issue-date-header') {
      return 'Attestation trop ancienne'
    }
    if (key === 'professional-errors.name-header') {
      return `Le nom ${params?.name} sur le document ne correspond pas au vôtre`
    }
    if (key === 'professional-errors.default-name-header') {
      return 'Une erreur de nom détectée sur le document'
    }
    if (key === 'professional-errors.multiple-header') {
      return 'Des erreurs sont détectées sur le document'
    }
    if (key === 'professional-errors.issue-date-bullet') {
      return `Attestation téléchargée le <strong>${params?.date}</strong>`
    }
    if (key === 'professional-errors.name-bullet') {
      return `Attestation au nom de <strong>${params?.name}</strong> différent du vôtre`
    }
    if (key === 'professional-errors.expected-issue-date') {
      return `Ajoutez un justificatif d'activité professionnelle téléchargée avant le <strong>${params?.minDate}</strong> depuis <a href="${params?.url}" target="_blank" rel="noopener noreferrer">mesdroitssociaux.gouv.fr</a>`
    }
    if (key === 'professional-errors.expected-name') {
      return `Ajoutez un justificatif d'activité professionnelle au nom de <strong>${params?.name}</strong> depuis <a href="${params?.url}" target="_blank" rel="noopener noreferrer">mesdroitssociaux.gouv.fr</a>`
    }
    if (key === 'professional-errors.expected-name-and-issue-date') {
      return `Ajoutez un justificatif d'activité professionnelle au nom de <strong>${params?.name}</strong>, téléchargée avant le <strong>${params?.minDate}</strong> depuis <a href="${params?.url}" target="_blank" rel="noopener noreferrer">mesdroitssociaux.gouv.fr</a>`
    }
    if (key === 'professional-errors.expected-default') {
      return `Ajoutez un justificatif d'activité professionnelle depuis <a href="${params?.url}" target="_blank" rel="noopener noreferrer">mesdroitssociaux.gouv.fr</a>`
    }
    return key
  }

  const strategy = new ProfessionalAnalysisErrorStrategy('cdi')

  it('sets subCategory properly', () => {
    expect(strategy.subCategory).toBe('cdi')
    const defaultStrategy = new ProfessionalAnalysisErrorStrategy()
    expect(defaultStrategy.subCategory).toBe('professional')
  })

  it('Case 1: Document expiré / Date d’émission trop ancienne (>1 mois)', () => {
    const failedRules: DocumentRule[] = [
      {
        rule: 'R_PROFESSIONAL_2DDOC_ISSUE_DATE',
        message: 'La date d’émission du 2D-Doc est supérieure à 1 mois',
        level: 'CRITICAL',
        ruleData: {
          extractedDate: '2026-08-01',
          type: 'R_EXPIRATION'
        }
      }
    ]

    expect(strategy.getHeaderTitle(failedRules, t)).toBe('Attestation trop ancienne')
    expect(strategy.getBulletList(failedRules, t)).toEqual([
      'Attestation téléchargée le <strong>1 août 2026</strong>'
    ])
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('téléchargée avant le')
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('mesdroitssociaux.gouv.fr')
  })

  it('Case 2: Mauvais nom (avec un seul nom extrait)', () => {
    const failedRules: DocumentRule[] = [
      {
        rule: 'R_PROFESSIONAL_NAME_MATCH',
        message: 'Le nom sur le 2D-Doc ne correspond pas',
        level: 'CRITICAL',
        ruleData: {
          expectedName: {
            firstNames: 'DIALLA BAH',
            lastName: 'KONATE',
            preferredName: null
          },
          extractedNames: [
            {
              firstNames: 'Jean',
              lastName: 'DUPONT',
              preferredName: null
            }
          ],
          type: 'R_NAMES'
        }
      }
    ]

    expect(strategy.getHeaderTitle(failedRules, t)).toBe(
      'Le nom DUPONT Jean sur le document ne correspond pas au vôtre'
    )
    expect(strategy.getBulletList(failedRules, t)).toEqual([
      'Attestation au nom de <strong>DUPONT Jean</strong> différent du vôtre'
    ])
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('DIALLA BAH KONATE')
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('mesdroitssociaux.gouv.fr')
  })

  it('Case 3: Mauvais nom (avec plusieurs noms extraits)', () => {
    const failedRules: DocumentRule[] = [
      {
        rule: 'R_PROFESSIONAL_NAME_MATCH',
        message: 'Le nom sur le 2D-Doc ne correspond pas',
        level: 'CRITICAL',
        ruleData: {
          expectedName: {
            firstNames: 'DIALLA BAH',
            lastName: 'KONATE',
            preferredName: null
          },
          extractedNames: [
            {
              firstNames: 'Alisia',
              lastName: 'Dallel',
              preferredName: null
            },
            {
              firstNames: 'Yassine',
              lastName: 'Dallel',
              preferredName: null
            }
          ],
          type: 'R_NAMES'
        }
      }
    ]

    expect(strategy.getHeaderTitle(failedRules, t)).toBe('Une erreur de nom détectée sur le document')
    expect(strategy.getBulletList(failedRules, t)).toEqual([
      'Attestation au nom de <strong>Dallel Alisia</strong> différent du vôtre',
      'Attestation au nom de <strong>Dallel Yassine</strong> différent du vôtre'
    ])
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('DIALLA BAH KONATE')
  })

  it('Case 4: Date d’émission dépassée + Mauvais nom (Erreurs multiples)', () => {
    const failedRules: DocumentRule[] = [
      {
        rule: 'R_PROFESSIONAL_NAME_MATCH',
        message: 'Le nom sur le 2D-Doc ne correspond pas',
        level: 'CRITICAL',
        ruleData: {
          expectedName: {
            firstNames: 'DIALLA BAH',
            lastName: 'KONATE',
            preferredName: null
          },
          extractedNames: [
            {
              firstNames: 'Laura',
              lastName: 'RECOBER',
              preferredName: null
            }
          ],
          type: 'R_NAMES'
        }
      },
      {
        rule: 'R_PROFESSIONAL_2DDOC_ISSUE_DATE',
        message: 'La date d’émission du 2D-Doc est supérieure à 1 mois',
        level: 'CRITICAL',
        ruleData: {
          extractedDate: '2026-08-01',
          type: 'R_EXPIRATION'
        }
      }
    ]

    expect(strategy.getHeaderTitle(failedRules, t)).toBe('Des erreurs sont détectées sur le document')
    expect(strategy.getBulletList(failedRules, t)).toEqual([
      'Attestation au nom de <strong>RECOBER Laura</strong> différent du vôtre',
      'Attestation téléchargée le <strong>1 août 2026</strong>'
    ])
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('DIALLA BAH KONATE')
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('téléchargée avant le')
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('mesdroitssociaux.gouv.fr')
  })

  it('returns undefined for getAction', () => {
    const failedRules: DocumentRule[] = [
      {
        rule: 'R_PROFESSIONAL_2DDOC_ISSUE_DATE',
        message: '',
        level: 'CRITICAL',
        ruleData: null
      }
    ]
    expect(strategy.getAction(failedRules, t)).toBeUndefined()
  })

  it('calls AnalyticsService.openAttestationMesDroitsSociaux on onLinkClick', () => {
    const spy = vi.spyOn(AnalyticsService, 'openAttestationMesDroitsSociaux').mockImplementation(() => {})
    strategy.onLinkClick?.('https://example.com')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('falls back to rule.message or default on unknown rule', () => {
    const unknownRule: DocumentRule[] = [
      {
        rule: 'R_UNKNOWN_CUSTOM',
        message: 'Message custom inconnu',
        level: 'CRITICAL',
        ruleData: null
      }
    ]
    expect(strategy.getHeaderTitle(unknownRule, t)).toBe('Message custom inconnu')
    expect(strategy.getBulletText(unknownRule[0], t)).toBe('Message custom inconnu')
    expect(strategy.getExpectedDocumentHtml(unknownRule, t)).toContain('mesdroitssociaux.gouv.fr')
  })
})
