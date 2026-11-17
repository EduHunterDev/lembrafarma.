import React from "react";
import { Link } from "react-router-dom";

export default function PlansPage() {
  return (
    <main className="page-shell" style={{ minHeight: "70vh", paddingBlock: "4rem" }}>
      <Link to="/" className="button button-outline">Voltar ao início</Link>
      <section className="page-panel" style={{ maxWidth: 800, margin: "2rem auto" }}>
        <div className="page-heading">
          <p className="eyebrow">LembraFarma</p>
          <h1>Conheça a gestão de recompras</h1>
          <p>Cadastre seus clientes, registre compras e veja quais recompras estão previstas. O envio de mensagens é iniciado manualmente pelo WhatsApp.</p>
        </div>
        <p>O módulo de cobrança e contratação de planos ainda não está disponível nesta versão.</p>
        <Link className="button" to="/pages/lembrafarma_auth.html#cadastro">Cadastrar minha farmácia</Link>
      </section>
    </main>
  );
}
