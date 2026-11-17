import { getAccessToken, getAccountStorageKey } from './accountStorage.js';

export async function apiRequest(path, { method = 'GET', body, signal } = {}) {
  const token = getAccessToken();
  if (!token) {
    const error = new Error('Entre na sua conta para acessar os dados.');
    error.status = 401;
    throw error;
  }
  const response = await fetch(`/api${path}`, {
    method,
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(result?.mensagem || result?.message || `Falha na API (HTTP ${response.status}).`);
    error.status = response.status;
    throw error;
  }
  if (result === null) throw new Error('A API retornou uma resposta inválida.');
  return result;
}

export function writeAccountCache(name, records) {
  const key = getAccountStorageKey(name);
  if (!key) return;
  try {
    const existing = localStorage.getItem(key);
    // A primeira sincronização preserva dados antigos para importação manual.
    if (existing && !localStorage.getItem(`${key}::sincronizado`)) {
      localStorage.setItem(`${key}::backup`, existing);
    }
    localStorage.setItem(key, JSON.stringify(records));
    localStorage.setItem(`${key}::sincronizado`, '1');
    window.dispatchEvent(new Event('lembrafarma:data-updated'));
  } catch (error) {
    console.warn('Falha ao salvar cache local; o banco continua como fonte principal.', error);
  }
}

export function normalizeClient(client) {
  return {
    ...client,
    endereco: {
      cep: client.cep || '',
      rua: client.logradouro || '',
      numero: client.numero || '',
      complemento: client.complemento || '',
      cidade: client.cidade || '',
      estado: client.estado || '',
    },
  };
}

export async function fetchClients() {
  const result = await apiRequest('/clientes');
  if (!Array.isArray(result.clientes)) throw new Error('A API retornou clientes inválidos.');
  const clientes = result.clientes.map(normalizeClient);
  writeAccountCache('lembrafarma.clientes', clientes);
  return clientes;
}

export async function fetchPurchases() {
  const result = await apiRequest('/compras');
  if (!Array.isArray(result.compras)) throw new Error('A API retornou compras inválidas.');
  writeAccountCache('lembrafarma-compras', result.compras);
  return result.compras;
}

export async function fetchMedicines() {
  const result = await apiRequest('/medicamentos');
  if (!Array.isArray(result)) throw new Error('A API retornou medicamentos inválidos.');
  writeAccountCache('lembrafarma.medicamentos', result);
  return result;
}
