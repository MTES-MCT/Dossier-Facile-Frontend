import { mount } from 'cypress/vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { SafeHtmlPlugin } from 'df-shared-next/src/services/SanitizeService'
import TaxErrorsHarness from './TaxErrorsHarness.vue'

function rule(code: string, ruleData: DocumentRule['ruleData'] = null): DocumentRule {
  return { rule: code, ruleData, level: 'CRITICAL', message: 'Technical backend message' }
}
const year = rule('R_TAX_WRONG_YEAR', {
  type: 'R_TAX_YEARS',
  expectedYear: 2025,
  extractedYears: [2024]
})
const names = rule('R_TAX_NAMES', {
  type: 'R_TAX_NAMES',
  expectedName: { firstNames: 'Christophe', lastName: 'Leconte', preferredName: null },
  extractedIdentities: ['RECOBER Laura']
})

// Wording is owned by the unit tests (TaxAnalysisErrors.spec.ts). Here the title only
// identifies the rendered variant; the rest checks what needs a real browser.
interface ErrorCase {
  id: string
  rules: DocumentRule[]
  title: string
  bullets: number
  guidance: boolean
}

const cases: ErrorCase[] = [
  {
    id: 'declarative',
    rules: [
      rule('R_TAX_BAD_CLASSIFICATION', {
        type: 'R_TAX_CLASSIFICATION',
        isDeclarativeSituation: true
      })
    ],
    title: "L'avis de situation déclarative n'est pas accepté",
    bullets: 1,
    guidance: true
  },
  {
    id: 'classification',
    rules: [
      rule('R_TAX_BAD_CLASSIFICATION', {
        type: 'R_TAX_CLASSIFICATION',
        isDeclarativeSituation: false
      })
    ],
    title: "Ce document n'est pas un avis d'impôt",
    bullets: 1,
    guidance: true
  },
  {
    id: 'pages',
    rules: [rule('R_TAX_LEAF')],
    title: "Il manque des pages à votre avis d'impôt",
    bullets: 1,
    guidance: true
  },
  {
    id: 'year',
    rules: [year],
    title: "Cet avis d'impôt est trop ancien",
    bullets: 1,
    guidance: true
  },
  {
    id: 'names',
    rules: [names],
    title: "Le nom RECOBER Laura sur l'avis d'impôt ne correspond pas au vôtre",
    bullets: 1,
    guidance: true
  },
  {
    id: 'multiple',
    rules: [year, names],
    title: 'Des erreurs sont détectées sur le document',
    bullets: 2,
    guidance: false
  }
]

for (const viewport of [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 375, height: 812 }
]) {
  describe(`Tax errors — ${viewport.name}`, () => {
    for (const scenario of cases) {
      it(`renders ${scenario.id} with accessible content and explanation`, () => {
        cy.viewport(viewport.width, viewport.height)
        // Any accidental application API request fails rather than reaching a real service.
        cy.intercept({ url: '**/api/**', middleware: true }, (request) => {
          throw new Error(
            `Unexpected API request in a component test: ${request.method} ${request.url}`
          )
        })
        const router = createRouter({
          history: createMemoryHistory(),
          routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }]
        })
        mount(TaxErrorsHarness, {
          props: { rules: scenario.rules },
          global: {
            plugins: [
              createPinia(),
              router,
              SafeHtmlPlugin,
              createI18n({
                legacy: false,
                locale: 'fr',
                fallbackLocale: 'fr',
                warnHtmlMessage: false
              })
            ]
          }
        })
        cy.document().then((doc) => doc.fonts.ready)
        cy.get('.analysis-error-block').should('be.visible').and('have.attr', 'role', 'alert')
        cy.get('h2.analysis-error-header-title').should('have.text', scenario.title)
        cy.get('h3.analysis-error-section-title').should('be.visible')
        cy.get('.analysis-error-bullets li').should('have.length', scenario.bullets)
        cy.get('.analysis-error-expected-text').should('be.visible')
        cy.get('.tax-analysis-guidance').should(scenario.guidance ? 'be.visible' : 'not.exist')
        if (scenario.id === 'pages' || scenario.id === 'names') {
          cy.get('.tax-analysis-guidance > ul > li')
            .should('have.length', 2)
            .each(($item) => {
              const item = $item[0]
              const style = item.ownerDocument.defaultView!.getComputedStyle(item, '::marker')
              expect(style.content).to.eq('normal')
              expect($item.css('list-style-type')).to.eq('disc')
            })
        }
        cy.get('label[for="explainText"]').should('be.visible')
        cy.get('#explain-info-text').should('be.visible')
        // Check actual browser layout, including clipped children in overflow:hidden containers.
        cy.get(
          '.analysis-error-header-title, .analysis-error-body, .tax-analysis-guidance, #explainText'
        ).each(($element) => {
          const element = $element[0]
          expect(element.scrollWidth, `${element.className}: no clipped content`).to.be.at.most(
            element.clientWidth + 1
          )
          const box = element.getBoundingClientRect()
          expect(box.left).to.be.at.least(0)
          expect(box.right).to.be.at.most(viewport.width)
        })
        cy.document().then((doc) =>
          expect(doc.documentElement.scrollWidth).to.be.at.most(viewport.width)
        )
        cy.injectAxe()
        cy.checkA11y('main', {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] }
        })
        cy.get('#explainText')
          .focus()
          .should('have.focus')
          .type('Mon explication fiscale personnelle')
          .blur()
          .should('have.value', 'Mon explication fiscale personnelle')
        if (scenario.id === 'names') {
          cy.get('.tax-analysis-guidance a[href="/nom-locataire"]').should('be.visible')
          cy.get('.tax-analysis-guidance button.fr-link').click()
          cy.get('dialog[open]').should('be.visible')
          cy.checkA11y('dialog[open]')
          cy.get('dialog[open] .fr-btn--close').click()
          cy.get('dialog[open]').should('not.exist')
          cy.get('#explainText').should('have.value', 'Mon explication fiscale personnelle')
        }
      })
    }
  })
}
