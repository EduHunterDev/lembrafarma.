describe('LembraFarma - Configurações do Sistema', () => {
  beforeEach(() => {
    cy.loginAuto();
  });

  it('Deve acessar a página de Configurações com sucesso', () => {
    cy.visit('http://localhost:5173/Ferrementas - Crie aqui/Configuracoes.html');
    cy.url().should('include', 'Configuracoes.html');
    cy.get('body').should('be.visible');
  });
});