import {Plugins} from '../../../src/constants/Plugins.constants';

const DemoTestExampleList = Plugins.REST.demoList;

describe('Create test', () => {
  beforeEach(() => {
    cy.inteceptHomeApiCall();
    cy.visit('/');
  });
  afterEach(() => cy.deleteTest(true));

  it('should create a basic GET test from scratch', () => {
    const name = `Test - Pokemon - #${String(Date.now()).slice(-4)}`;
    cy.navigateToTestCreationPage();
    cy.fillCreateFormBasicStep(name);
    cy.setCreateFormUrl('GET', 'http://demo-pokemon-api.demo.svc.cluster.local/pokemon');
    cy.submitCreateTestForm();
    cy.makeSureUserIsOnTracePage();
    cy.get('[data-cy=test-details-name]').should('have.text', `${name} (v1)`);
  });

  it('should create a basic POST test from scratch', () => {
    const name = `Test - Pokemon - #${String(Date.now()).slice(-4)}`;
    cy.navigateToTestCreationPage();
    cy.fillCreateFormBasicStep(name);
    cy.setCreateFormUrl('POST', 'http://demo-pokemon-api.demo.svc.cluster.local/pokemon');
    cy.get('[data-cy=body]').type(
      '{"name":"meowth","type":"normal","imageUrl":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/052.png","isFeatured":true}',
      {
        parseSpecialCharSequences: false,
      }
    );
    cy.submitCreateTestForm();
    cy.makeSureUserIsOnTracePage();
    cy.get('[data-cy=test-details-name]').should('have.text', `${name} (v1)`);
  });

  it('should create a GET test from an example', () => {
    const [{name}] = DemoTestExampleList;
    cy.createTestByName(name);
  });

  it('should create a POST test from an example', () => {
    const [, {name}] = DemoTestExampleList;
    cy.createTestByName(name);
  });
});
