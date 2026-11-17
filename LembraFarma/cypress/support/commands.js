// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginAuto', () => {
  const uniqueId = Date.now();
  const email = `auto.${uniqueId}@farmacia.com`;
  const senha = 'SenhaForte123!';
  const cnpj = String(uniqueId).slice(-14).padStart(14, '0');

  cy.visit('http://localhost:5173/pages/lembrafarma_auth.html');
  cy.contains('button', 'Cadastrar-se').click();

  cy.get('#pharmacy-name').type(`Farmácia Auto ${uniqueId}`);
  cy.get('#cnpj-input').type(cnpj);
  cy.get('#register-email').type(email);
  cy.get('#phone-input').type('85999998888');
  cy.get('#reg-password').type(senha);
  cy.get('#reg-confirm-password').type(senha);
  cy.get('#terms').check();
  cy.get('#register-form button[type="submit"]').click();

  cy.contains('Cadastro da farmácia efetuado com sucesso', { timeout: 6000 }).should('be.visible');

  cy.contains('button', 'Acessar Conta').click();
  cy.get('#login-email').type(email);
  cy.get('#login-password').type(senha);
  cy.get('#login-form button[type="submit"]').click();

  cy.url({ timeout: 6000 }).should('include', 'Dashboard.html');
});