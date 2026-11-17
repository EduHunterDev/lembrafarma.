describe('LembraFarma - Gestão de Medicamentos', () => {
  beforeEach(() => {
    // Faz o login programaticamente ou injeta o token antes de acessar as rotas protegidas
    cy.visit('http://localhost:5173/pages/lembrafarma_auth.html');
    cy.get('#login-email').type('drogasul@gmail.com'); // Substitua por um e-mail válido
    cy.get('#login-password').type('12345678');     // Substitua pela senha válida
    cy.get('#login-form button[type="submit"]').click();
    
    // Aguarda o redirecionamento para o dashboard
    cy.url({ timeout: 4000 }).should('include', 'Dashboard.html');
  });

  it('Deve navegar para a página de Medicamentos e carregar a interface', () => {
    // Acessa diretamente a rota protegida de medicamentos
    cy.visit('http://localhost:5173/Ferrementas - Crie aqui/Medicamentos.html');

    // Valida se a URL está correta
    cy.url().should('include', 'Medicamentos.html');

    // Verifica se elementos estruturais da página aparecem (ex: título ou botão de cadastro/busca)
    cy.get('body').should('contain', 'Medicamento');
  });
});