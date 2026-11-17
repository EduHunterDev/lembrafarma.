import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { authenticateAccount, clearAuthenticatedAccount } from '../src/utils/accountStorage.js';
import { apiRequest, fetchClients, fetchPurchases, fetchMedicines } from '../src/utils/apiClient.js';

function memoryStorage() {
  const m = new Map();
  return { getItem: key => m.get(key) || null, setItem: (key, value) => m.set(key, String(value)), removeItem: key => m.delete(key) };
}
const originalFetch = globalThis.fetch;
const originalLocal = globalThis.localStorage;
const originalSession = globalThis.sessionStorage;
const originalWindow = globalThis.window;

beforeEach(() => {
  globalThis.localStorage = memoryStorage();
  globalThis.sessionStorage = memoryStorage();
  globalThis.window = { dispatchEvent() {} };
  authenticateAccount('farmacia@example.test', 'jwt');
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  globalThis.localStorage = originalLocal;
  globalThis.sessionStorage = originalSession;
  globalThis.window = originalWindow;
});

test('rotas unificadas enviam token e convertem clientes/compra/medicamento', async () => {
  const requisicoes = [];
  globalThis.fetch = async (url, options) => {
    requisicoes.push([url, options.headers.Authorization]);
    const body = url === '/api/clientes' ? { clientes: [{ id: 5, nome: 'Ana', logradouro: 'Rua 1' }] } :
      url === '/api/compras' ? { compras: [{ id: 2, cliente: 'Ana', produto: 'Teste' }] } :
      [{ id: 3, clienteNome: 'Ana', medicamento: { nome: 'Teste' } }];
    return { ok: true, status: 200, json: async () => body };
  };
  const [clients, purchases, medicines] = await Promise.all([fetchClients(), fetchPurchases(), fetchMedicines()]);
  assert.equal(clients[0].endereco.rua, 'Rua 1');
  assert.equal(purchases[0].cliente, 'Ana');
  assert.equal(medicines[0].clienteNome, 'Ana');
  assert.deepEqual(requisicoes, [
    ['/api/clientes', 'Bearer jwt'], ['/api/compras', 'Bearer jwt'], ['/api/medicamentos', 'Bearer jwt'],
  ]);
});

test('API indisponível não finge sucesso nem cria registros só no navegador', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 500, json: async () => ({ mensagem: 'Banco indisponível' }) });
  await assert.rejects(() => apiRequest('/compras', { method: 'POST', body: { clienteId: 1 } }), /Banco indisponível/);
  clearAuthenticatedAccount();
  await assert.rejects(() => apiRequest('/compras'), /Entre na sua conta/);
});
