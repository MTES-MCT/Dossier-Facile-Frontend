import { updateFinancialURL } from '../components/financial/lib/updateFinancialUrl'
import { describe, it, expect } from 'vitest'

describe('updateFinancialURL', () => {
  it('replace id in URL', () => {
    const url = updateFinancialURL('/documents-locataire/4/855/travail/salarie/plus-3-mois', 855)
    expect(url).to.eq('/documents-locataire/4/ajouter/travail/salarie/plus-3-mois')
  })
  it('replace final id in URL', () => {
    const url = updateFinancialURL('/documents-locataire/4/855', 855)
    expect(url).to.eq('/documents-locataire/4/ajouter')
  })
  it('replace id in URL for spouse', () => {
    const url = updateFinancialURL('/documents-colocataire/273/4/4/856/social/caf/plus-3-mois', 856)
    expect(url).to.eq('/documents-colocataire/273/4/4/ajouter/social/caf/plus-3-mois')
  })
})
