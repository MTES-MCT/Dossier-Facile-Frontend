export const updateFinancialURL = (url: string, docId: number | undefined) =>
  url.replace(`/${docId}/`, '/ajouter/').replace(new RegExp(`/${docId}$`), '/ajouter')
