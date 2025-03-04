Cypress.on('uncaught:exception', err => !err.message.includes('ResizeObserver loop limit exceeded'));

const testIdRegex = /\/test\/([a-z0-9-]+)/;
const runIdRegex = /\/run\/([a-z0-9-]+)/;

export const getTestId = (pathname: string) => {
  cy.log(pathname);
  const result = pathname.match(testIdRegex);
  const testId = result.length > 1 ? result[1] : '';
  cy.log(testId);
  return testId;
};

export const getResultId = (pathname: string) => {
  cy.log(pathname);
  const result = pathname.match(runIdRegex);
  const runId = result.length > 1 ? result[1] : '';
  cy.log(runId);
  return runId;
};
