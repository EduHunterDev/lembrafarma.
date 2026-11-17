'use strict';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'local-integration-test-not-for-production';
process.env.DB_SSL = 'false';
const assert = require('node:assert/strict');
const { before, after, test } = require('node:test');
const db = require('../src/models');
const app = require('../src/server');

let server;
let base;
before(async () => {
  await db.sequelize.sync();
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  await db.sequelize.close();
});
async function req(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${base}/api${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json();
  return { status: response.status, data };
}

test('fluxo real da interface: login, perfil, clientes, compras, alertas, medicamentos e senha', async () => {
  const email = `full-${Date.now()}@example.test`;
  assert.equal((await req('/clientes')).status, 401);
  assert.equal((await req('/health')).status, 200);

  const register = await req('/usuarios', { method: 'POST', body: { nome: 'Farmácia Teste', email, senha: 'SenhaInicial#123' } });
  assert.equal(register.status, 201);
  const login = await req('/usuarios/login', { method: 'POST', body: { email, senha: 'SenhaInicial#123' } });
  assert.equal(login.status, 200);
  const token = login.data.token;
  const profile = await req('/perfil', { token });
  assert.equal(profile.data.usuario.nome, 'Farmácia Teste');

  const cliente = await req('/clientes', { method: 'POST', token, body: {
    nome: 'Cliente Real', cpf: '12345678909', telefone: '85999999999',
    email: 'cliente@example.test', logradouro: 'Rua das Flores', numero: '12',
    cep: '60000000', cidade: 'Fortaleza', estado: 'CE'
  } });
  assert.equal(cliente.status, 201);
  assert.equal(cliente.data.cliente.logradouro, 'Rua das Flores');
  assert.equal((await req('/clientes', { token })).data.clientes.length, 1);

  const compra = await req('/compras', { method: 'POST', token, body: {
    clienteId: cliente.data.cliente.id, produto: 'Losartana', dosagem: '50 mg',
    quantidadeCaixas: 2, dataCompra: '2026-11-17', duracao: 30
  } });
  assert.equal(compra.status, 201);
  assert.equal(compra.data.compra.dataRecompra, '2026-12-17');
  const compras = await req('/compras', { token });
  assert.equal(compras.data.compras.length, 1);
  assert.equal(compras.data.compras[0].telefone, '85999999999');
  const alertas = await req('/alertas', { token });
  assert.equal(alertas.data.alertas.length, 1);
  assert.equal(alertas.data.alertas[0].data_prevista, '2026-12-17');
  assert.equal((await req('/compras', { method: 'POST', token, body: {
    clienteId: 99999999, produto: 'Losartana', dosagem: '50 mg',
    quantidadeCaixas: 2, dataCompra: '2026-11-17', duracao: 30
  } })).status, 404);
  assert.equal((await req('/compras', { token })).data.compras.length, 1);

  const medicamentoPayload = {
    clienteId: cliente.data.cliente.id,
    medicamento: { registro: '123456789', nome: 'Losartana', principioAtivo: 'Losartana' },
    apresentacao: 'Comprimido', quantidade: 30, intervaloCompra: '30', intervaloCompraDias: 30,
    observacoes: 'Teste'
  };
  const medicamento = await req('/medicamentos', { method: 'POST', token, body: medicamentoPayload });
  assert.equal(medicamento.status, 201);
  assert.equal(medicamento.data.medicamento.nome, 'Losartana');
  assert.equal((await req('/medicamentos', { token })).data.length, 1);
  assert.equal((await req(`/medicamentos/${medicamento.data.id}`, { method: 'PUT', token, body: { ...medicamentoPayload, quantidade: 40 } })).data.quantidade, 40);

  const profileUpdated = await req('/me/profile', { method: 'PUT', token, body: { name: 'Nova Farmácia', photo: 'data:image/png;base64,aGVsbG8=' } });
  assert.equal(profileUpdated.status, 200);
  assert.equal((await req('/perfil', { token })).data.usuario.foto, 'data:image/png;base64,aGVsbG8=');
  assert.equal((await req('/me/password', { method: 'PUT', token, body: { currentPassword: 'errada', newPassword: 'SenhaNova#456' } })).status, 403);
  assert.equal((await req('/me/password', { method: 'PUT', token, body: { currentPassword: 'SenhaInicial#123', newPassword: 'SenhaNova#456' } })).status, 200);
  assert.equal((await req('/usuarios/login', { method: 'POST', body: { email, senha: 'SenhaInicial#123' } })).status, 401);
  assert.equal((await req('/usuarios/login', { method: 'POST', body: { email, senha: 'SenhaNova#456' } })).status, 200);
  assert.equal((await req(`/medicamentos/${medicamento.data.id}`, { method: 'DELETE', token })).status, 200);
  assert.deepEqual((await req('/medicamentos', { token })).data, []);
});
