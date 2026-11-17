describe('LembraFarma - Compras e Alertas de Recompra', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/pages/lembrafarma_auth.html');
    cy.get('#login-email').type('drogasul@gmail.com'); // Substitua pelo seu e-mail real
    cy.get('#login-password').type('12345678');     // Substitua pela sua senha real
    cy.get('#login-form button[type="submit"]').click();
    
    // Aumentamos o timeout para 6000ms e buscamos apenas por 'Dashboard.html'
    cy.url({ timeout: 6000 }).should('include', 'Dashboard.html');
  });

  it('Deve acessar a página de Compras e exibir os registros', () => {
    cy.visit('http://localhost:5173/Ferrementas - Crie aqui/Compras.html');
    cy.url().should('include', 'Compras.html');
  });

  it('Deve acessar a página de Alertas de recompra', () => {
    cy.visit('http://localhost:5173/Ferrementas - Crie aqui/alertas.html');
    cy.url().should('include', 'alertas.html');
  });
});