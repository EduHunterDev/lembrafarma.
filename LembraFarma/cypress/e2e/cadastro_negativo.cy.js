describe('LembraFarma - Cenários Negativos de Cadastro', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/pages/lembrafarma_auth.html');
    cy.contains('button', 'Cadastrar-se').click();
  });

  it('Deve exibir erro quando as senhas digitadas não coincidem', () => {
    cy.get('#pharmacy-name').type('Farmácia Teste Erro Ltda');
    cy.get('#cnpj-input').type('12345678000199');
    cy.get('#register-email').type('erro.senha@farmacia.com');
    cy.get('#phone-input').type('85988887777');
    
    // Senhas diferentes
    cy.get('#reg-password').type('senha12345');
    cy.get('#reg-confirm-password').type('senhaDiferente');
    
    cy.get('#terms').check();
    cy.get('#register-form button[type="submit"]').click();

    // Valida se o toast/alerta de erro informando que as senhas não coincidem apareceu
    cy.contains('As senhas digitadas não coincidem').should('be.visible');
  });
});