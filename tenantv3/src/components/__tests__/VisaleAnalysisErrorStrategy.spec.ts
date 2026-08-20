import { describe, expect, it } from 'vitest'
import { VisaleAnalysisErrorStrategy } from '../analysis/strategies/VisaleAnalysisErrorStrategy'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'

describe('VisaleAnalysisErrorStrategy', () => {
  const t = (key: string, params?: Record<string, any>) => {
    if (key === 'visale-errors.expiration-header') {
      return `Ce document est expiré depuis le ${params?.date}`
    }
    if (key === 'visale-errors.bad-classification-header') {
      return "Ce n’est pas le certificat attendu"
    }
    if (key === 'visale-errors.name-header') {
      return 'Une erreur de nom détectée sur le document'
    }
    if (key === 'visale-errors.multiple-header') {
      return 'Des erreurs sont détectées sur le document'
    }
    if (key === 'visale-errors.expiration-bullet') {
      return `Expiré depuis le <strong>${params?.date}</strong>`
    }
    if (key === 'visale-errors.name-bullet') {
      return `Attestation au nom de <strong>${params?.name}</strong> différent du vôtre`
    }
    if (key === 'visale-errors.expected-expiration') {
      return 'Ajoutez votre certificat de garantie Visale <strong>en cours de validité</strong>'
    }
    if (key === 'visale-errors.expected-classification') {
      return 'Ajoutez votre certificat de garantie Visale, voir un exemple dans <a href="https://aide.dossierfacile.logement.gouv.fr/fr/article/organisme-garant-1ne3cvn/" target="_blank" rel="noopener noreferrer">notre aide en ligne</a>'
    }
    if (key === 'visale-errors.expected-name') {
      return `Ajoutez votre certificat de garantie Visale au nom de <strong>${params?.name}</strong>`
    }
    if (key === 'visale-errors.expected-name-and-expiration') {
      return `Ajoutez votre certificat de garantie Visale au nom de <strong>${params?.name}</strong> et <strong>en cours de validité</strong>`
    }
    return key
  }

  const strategy = new VisaleAnalysisErrorStrategy()

  it('Case 1: Document expiré', () => {
    const failedRules: DocumentRule[] = [
      {
        rule: 'R_VISALE_CERTIFICATE_EXPIRATION',
        message: 'Le certificat Visale a expiré',
        level: 'CRITICAL',
        ruleData: {
          extractedDate: '2026-01-18',
          type: 'R_EXPIRATION'
        }
      }
    ]

    expect(strategy.getHeaderTitle(failedRules, t)).toBe('Ce document est expiré depuis le 18/01/2026')
    expect(strategy.getBulletList(failedRules, t)).toEqual([])
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('en cours de validité')
  })

  it('Case 2: Mauvais document', () => {
    const failedRules: DocumentRule[] = [
      {
        rule: 'R_DOCUMENT_IA_CLASSIFICATION',
        message: "Le document n'a pas été correctement classifié par Document IA",
        level: 'CRITICAL',
        ruleData: null
      }
    ]

    expect(strategy.getHeaderTitle(failedRules, t)).toBe('Ce n’est pas le certificat attendu')
    expect(strategy.getBulletList(failedRules, t)).toEqual([])
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('notre aide en ligne')
  })

  it('Case 3: Mauvais nom (avec plusieurs noms extraits)', () => {
    const failedRules: DocumentRule[] = [
      {
        rule: 'R_VISALE_CERTIFICATE_NAME_MATCH',
        message: 'Le nom sur le certificat Visale ne correspond pas',
        level: 'CRITICAL',
        ruleData: {
          expectedName: {
            firstNames: 'Jean-Luc',
            lastName: 'Laplanche',
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
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('Jean-Luc Laplanche')
  })

  it('Case 4: Document expiré + Mauvais nom (Multiple errors)', () => {
    const failedRules: DocumentRule[] = [
      {
        rule: 'R_VISALE_CERTIFICATE_NAME_MATCH',
        message: 'Le nom sur le certificat Visale ne correspond pas',
        level: 'CRITICAL',
        ruleData: {
          expectedName: {
            firstNames: 'Jean-Luc',
            lastName: 'Laplanche',
            preferredName: null
          },
          extractedNames: [
            {
              firstNames: 'Laura',
              lastName: 'RECOBER',
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
      },
      {
        rule: 'R_VISALE_CERTIFICATE_EXPIRATION',
        message: 'Le certificat Visale a expiré',
        level: 'CRITICAL',
        ruleData: {
          extractedDate: '2026-01-18',
          type: 'R_EXPIRATION'
        }
      }
    ]

    expect(strategy.getHeaderTitle(failedRules, t)).toBe('Des erreurs sont détectées sur le document')
    expect(strategy.getBulletList(failedRules, t)).toEqual([
      'Attestation au nom de <strong>RECOBER Laura</strong> différent du vôtre',
      'Attestation au nom de <strong>Dallel Yassine</strong> différent du vôtre',
      'Expiré depuis le <strong>18/01/2026</strong>'
    ])
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('Jean-Luc Laplanche')
    expect(strategy.getExpectedDocumentHtml(failedRules, t)).toContain('en cours de validité')
  })

  it('returns AnalysisErrorAction with error-specific customEventName for Visale', () => {
    const expirationRule: DocumentRule[] = [{ rule: 'R_VISALE_CERTIFICATE_EXPIRATION', message: '', level: 'CRITICAL', ruleData: null }]
    expect(strategy.getAction(expirationRule, t)?.customEventName).toBe('errorGuarantorExpiration')

    const classificationRule: DocumentRule[] = [{ rule: 'R_DOCUMENT_IA_CLASSIFICATION', message: '', level: 'CRITICAL', ruleData: null }]
    expect(strategy.getAction(classificationRule, t)?.customEventName).toBe('errorGuarantorClassification')

    const nameRule: DocumentRule[] = [{ rule: 'R_VISALE_CERTIFICATE_NAME_MATCH', message: '', level: 'CRITICAL', ruleData: null }]
    expect(strategy.getAction(nameRule, t)?.customEventName).toBe('errorGuarantorName')

    const multiRules: DocumentRule[] = [expirationRule[0], nameRule[0]]
    expect(strategy.getAction(multiRules, t)?.customEventName).toBe('multipleError')
  })
})
