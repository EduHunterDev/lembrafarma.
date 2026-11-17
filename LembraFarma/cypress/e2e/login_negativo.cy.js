describe('LembraFarma - Cenários Negativos de Autenticação', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/pages/lembrafarma_auth.html');
  });

  it('Deve exibir erro ao tentar logar com senha incorreta', () => {
    cy.get('#login-email').type('drogasul@gmail.com'); // Substitua por um e-mail existente
    cy.get('#login-password').type('senhaerrada123');
    cy.get('#login-form button[type="submit"]').click();

    // Valida se o toast/alerta de erro apareceu na tela
    cy.contains('E-mail ou senha incorretos').should('be.visible');
    // Garante que continua na página de auth
    cy.url().should('include', '/pages/lembrafarma_auth.html');
  });

  it('Deve exigir preenchimento dos campos obrigatórios', () => {
    // Tenta enviar o formulário vazio
    cy.get('#login-form button[type="submit"]').click();
    
    // O HTML5 validation impede o envio e mantém o foco no campo de e-mail
    cy.get('#login-email').then(($input) => {
      expect($input[0].validationMessage).to.not.be.empty;
    });
  });
});