describe('Create test with authentication', () => {
  beforeEach(() => {
    cy.inteceptHomeApiCall();
    cy.visit('/');
  });

  it('should create a basic GET test with api key authentication method', () => {
    cy.navigateToTestCreationPage();
    cy.createTestWithAuth('apiKey', ['key', 'value']).then(name => {
      cy.get('[data-cy=auth-apiKey-select]').click();
      cy.get(`[data-cy=auth-apiKey-select-option-header]`).click();
      cy.submitAndMakeSureTestIsCreated(name);
    });
  });

  it('should create a basic GET test with basic authentication method', () => {
    cy.navigateToTestCreationPage();
    cy.createTestWithAuth('basic', ['username', 'password']).then(name => {
      cy.submitAndMakeSureTestIsCreated(name);
    });
  });

  it('should create a basic GET test with bearer authentication method', () => {
    cy.navigateToTestCreationPage();
    cy.createTestWithAuth('bearer', ['token']).then(name => {
      cy.submitAndMakeSureTestIsCreated(name);
    });
  });
});
