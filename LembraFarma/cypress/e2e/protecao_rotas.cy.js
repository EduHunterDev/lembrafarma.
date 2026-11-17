describe('LembraFarma - Segurança e Proteção de Rotas', () => {
  it('Deve redirecionar para a tela de login ao tentar acessar o dashboard sem autenticação', () => {
    // Tenta acessar a ferramenta sem estar logado
    cy.visit('http://localhost:5173/Ferrementas - Crie aqui/Dashboard.html', { failOnStatusCode: false });

    // Como o App.jsx valida o isAuthenticatedAccount(), deve barrar e mandar para o Auth
    cy.url().should('include', '/pages/lembrafarma_auth.html');
  });
});