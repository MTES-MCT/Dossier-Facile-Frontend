export function terminalLog(violations: any[]) {
  // This function comes from https://www.npmjs.com/package/cypress-axe
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      violations: nodes.length,
      elements: nodes.map((node: any) => node.target).join(", ")
    })
  )
  cy.task('table', violationData)
}

export function log() {
  return {
    log(message:string) {
      console.log(message);
      return null;
    },
    table(message: string) {
      console.table(message);
      return null;
    }
  };
}