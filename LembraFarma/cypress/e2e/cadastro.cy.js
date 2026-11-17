describe('LembraFarma - Fluxo de Cadastro de Farmácia', () => {
  it('Deve alternar para a aba de cadastro e preencher o formulário com dados únicos', () => {
    cy.visit('http://localhost:5173/pages/lembrafarma_auth.html');

    // Clica na aba de cadastro
    cy.contains('button', 'Cadastrar-se').click();

    // Gera um timestamp único para evitar erro 409 (Conflito de duplicidade)
    const uniqueId = Date.now();
    const emailUnico = `teste.${uniqueId}@farmacia.com`;
    const cnpjUnico = String(uniqueId).slice(-14).padStart(14, '0'); // Gera 14 dígitos numéricos para o CNPJ

    // Preenche os campos do formulário
    cy.get('#pharmacy-name').type(`Farmácia Teste ${uniqueId} Ltda`);
    cy.get('#cnpj-input').type(cnpjUnico);
    cy.get('#register-email').type(emailUnico);
    cy.get('#phone-input').type('85988887777');
    cy.get('#reg-password').type('senhaSegura123');
    cy.get('#reg-confirm-password').type('senhaSegura123');
    
    // Aceita os termos
    cy.get('#terms').check();

    // Envia o formulário
    cy.get('#register-form button[type="submit"]').click();

    // Valida a mensagem de sucesso
    cy.contains('Cadastro da farmácia efetuado com sucesso', { timeout: 6000 }).should('be.visible');
  });
});