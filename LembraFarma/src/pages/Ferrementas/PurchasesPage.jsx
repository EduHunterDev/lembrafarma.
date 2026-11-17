import React, { useEffect, useState } from "react";
import ToolSidebar from "../../components/ToolSidebar.jsx";
import { apiRequest, fetchClients, fetchPurchases, fetchMedicines, writeAccountCache } from "../../utils/apiClient.js";

const products = [
  "Losartana Potássica",
  "Cloridrato de Metformina",
  "Sinvastatina",
  "Levotiroxina Sódica",
  "Cloridrato de Fluoxetina",
  "Omeprazol",
  "Clonazepam (Rivotril)",
  "Sertralina (Cloridrato)",
  "Finasterida",
  "Dutasterida",
];
const dosages = ["25 mg", "50 mg", "100 mg", "200 mg", "500 mg", "Outra"];

function getLocalDateString(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [clients, setClients] = useState([]);
  const [registeredProducts, setRegisteredProducts] = useState([]);
  const [notice, setNotice] = useState("A data estimada será exibida aqui.");
  const [loadError, setLoadError] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([fetchClients(), fetchPurchases(), fetchMedicines()])
      .then(([nextClients, nextPurchases, nextMedicines]) => {
        if (active) {
          setClients(nextClients);
          setPurchases(nextPurchases);
          setRegisteredProducts(nextMedicines.map(m => m?.medicamento?.nome).filter(Boolean));
          setLoadError(false);
        }
      })
      .catch(error => {
        console.error('Falha ao carregar dados do banco:', error);
        if (active) { setLoadError(true); setNotice(error.message); }
      });
    return () => { active = false; };
  }, []);

  function handlePreview(event) {
    const formData = new FormData(event.currentTarget.form);
    const purchaseDate = String(formData.get("dataCompra") || "");
    const duration = Number(formData.get("duracao"));

    if (!purchaseDate || !Number.isInteger(duration) || duration < 1) {
      setNotice("Informe a data da compra e uma duração válida.");
      return;
    }

    const [year, month, day] = purchaseDate.split("-").map(Number);
    const estimatedDate = new Date(year, month - 1, day);
    estimatedDate.setDate(estimatedDate.getDate() + duration);
    setNotice(`Próxima recompra estimada: ${formatDate(getLocalDateString(estimatedDate))}`);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const clienteId = String(formData.get('cliente') || '');
    const produto = String(formData.get('produto') || '').trim();
    const dataCompra = String(formData.get('dataCompra') || '');
    const duracao = Number(formData.get('duracao'));
    const dosagem = String(formData.get('dosagem') || '');
    const quantidadeCaixas = Number(formData.get('quantity'));
    if (!clienteId || !produto || !dataCompra || !Number.isInteger(duracao) || duracao < 1 ||
        !dosagem || !Number.isInteger(quantidadeCaixas) || quantidadeCaixas < 1) {
      setNotice('Confira os dados da compra.');
      return;
    }
    setSaving(true);
    try {
      const result = await apiRequest('/compras', {
        method: 'POST',
        body: { clienteId, produto, dosagem, quantidadeCaixas, dataCompra, duracao },
      });
      const nextPurchases = [...purchases, result.compra];
      setPurchases(nextPurchases);
      writeAccountCache('lembrafarma-compras', nextPurchases);
      setNotice('Compra e alerta de recompra registrados no banco de dados!');
      form.reset();
    } catch (error) {
      console.error('Falha ao salvar compra:', error);
      setNotice(error.message || 'Não foi possível salvar a compra no banco de dados.');
    } finally {
      setSaving(false);
    }
  }

  const today = getLocalDateString(new Date());
  const sortedPurchases = [...purchases].sort((a, b) =>
    a.dataRecompra.localeCompare(b.dataRecompra),
  );

  return (
    <div className="tool-layout">
      <ToolSidebar active="Compras" />
      <main className="tool-layout-content page-shell">
      <header className="page-heading">
        <h1>Gestão de Compras</h1>
        <p>
          Acompanhe as compras registradas e a data estimada para a próxima
          recompra dos seus clientes.
        </p>
      </header>

      <section className="purchase-stats" aria-label="Resumo das recompras">
        <article className="stat-card">
          <div className="stat-icon"><span aria-hidden="true">▦</span></div>
          <div>
            <p>Recompras previstas</p>
            <strong id="total-recompras">{purchases.length}</strong>
            <span>Registros cadastrados</span>
          </div>
        </article>
        <article className="stat-card">
          <div className="stat-icon"><span aria-hidden="true">◷</span></div>
          <div>
            <p>Previstas para hoje</p>
            <strong id="recompras-hoje">{purchases.filter((purchase) => purchase.dataRecompra === today).length}</strong>
            <span>Data estimada para hoje</span>
          </div>
        </article>
      </section>

      <section className="step-grid">
        <form id="form-compra" className="form-card" onSubmit={handleSubmit}>
          <h2>Registrar Compra</h2>
          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="cliente">Cliente</label>
              <select id="cliente" name="cliente" required defaultValue="">
                <option value="">Selecione um cliente</option>
                {clients.map((client) =>( <option key={client.id} value={client.id}>{client.nome}</option>))}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="produto">Produto</label>
              <input id="produto" name="produto" type="text" list="lista-produtos" maxLength={200} placeholder="Digite o medicamento" required />
              <datalist id="lista-produtos">
                {[...new Set([...products, ...registeredProducts])].map(product => <option key={product} value={product} />)}
              </datalist>
            </div>
            <div className="field-group">
              <label htmlFor="dosagem">Dosagem</label>
              <select id="dosagem" name="dosagem" required defaultValue="">
                <option value="">Selecione a dosagem</option>
                {dosages.map((dosage) => <option key={dosage}>{dosage}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="quantidade-caixas">Quantidade de Caixas</label>
              <input id="quantidade-caixas" name="quantity" type="number" min="1" step="1" placeholder="Ex.: 2" required />
            </div>
            <div className="field-group">
              <label htmlFor="data-compra">Data da compra</label>
              <input id="data-compra" name="dataCompra" type="date" onChange={handlePreview} required />
            </div>
            <div className="field-group">
              <label htmlFor="duracao">Duração estimada (dias)</label>
              <input id="duracao" name="duracao" type="number" min="1" onChange={handlePreview} required />
            </div>
          </div>
          <p id="data-prevista" aria-live="polite" role={loadError ? "alert" : "status"}>{notice}</p>
          <button type="submit" className="button" disabled={saving || loadError}>{saving ? "Salvando..." : "Registrar Compra"}</button>
        </form>
      </section>

      <section className="panel-card">
        <h2>Próximas recompras</h2>
        {loadError ? (
          <p role="alert">Não foi possível carregar as compras salvas.</p>
        ) : sortedPurchases.length ? (
          <div id="lista-recompras" className="client-list">
            {sortedPurchases.map((purchase) => (
              <article className="client-item" key={purchase.id}>
                <strong>{purchase.cliente} — {purchase.produto}</strong>
                <span>{purchase.dosagem || "Dosagem não informada"} • {purchase.quantidadeCaixas ?? "—"} caixa(s)</span>
                <span>Data estimada: {formatDate(purchase.dataRecompra)}</span>
                <small>Contato: {purchase.contato}</small>
              </article>
            ))}
          </div>
        ) : (
          <div id="lista-recompras" className="client-list">
            <p className="empty-state">Nenhuma recompra registrada.</p>
          </div>
        )}
      </section>
      </main>
    </div>
  );
}
