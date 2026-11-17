import { useEffect, useState } from "react";
import { apiRequest, fetchClients, normalizeClient, writeAccountCache } from "../../../utils/apiClient.js";

export default function useClientsStorage() {
  const [clients, setClients] = useState([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    fetchClients()
      .then(data => { if (active) { setClients(data); setLoadError(false); } })
      .catch(error => { console.error(error); if (active) setLoadError(true); });
    return () => { active = false; };
  }, []);

  async function addClient(client) {
    try {
      const { endereco = {} } = client;
      const result = await apiRequest('/clientes', {
        method: 'POST',
        body: {
          nome: client.nome,
          cpf: client.cpf?.replace(/\D/g, '') || null,
          telefone: client.telefone || null,
          email: client.email || null,
          cep: endereco.cep || null,
          logradouro: endereco.rua || null,
          numero: endereco.numero || null,
          complemento: endereco.complemento || null,
          cidade: endereco.cidade || null,
          estado: endereco.estado || null,
        },
      });
      if (!result.cliente?.id) throw new Error('A API não retornou o cliente criado.');
      const next = [...clients, normalizeClient(result.cliente)];
      setClients(next);
      writeAccountCache('lembrafarma.clientes', next);
      setLoadError(false);
      return true;
    } catch (error) {
      console.error('Falha ao cadastrar cliente no banco:', error);
      return false;
    }
  }

  return { clients, loadError, addClient };
}
