describe('LembraFarma - Fluxo de Autenticação', () => {
  it('Deve fazer login com sucesso e redirecionar para o dashboard', () => {
    cy.visit('http://localhost:5173/pages/lembrafarma_auth.html');
    
    cy.get('#login-email').type('drogasul@gmail.com'); // Substitua pelo seu e-mail real
    cy.get('#login-password').type('12345678');     // Substitua pela sua senha real
    
    cy.get('#login-form button[type="submit"]').click();
    
    // Aguarda o timeout do redirect e valida a URL com espaço codificado ou parte do caminho
    cy.url({ timeout: 3000 }).should('include', 'Dashboard.html');
  });
});