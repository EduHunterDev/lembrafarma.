'use strict';
const { Medicamento, Cliente } = require('../models');
const { isId, isObject, errorResponse } = require('../utils/api');

function toPublic(registro) {
  return { ...JSON.parse(registro.dados), id: registro.id, clienteId: registro.cliente_id };
}
function validar(dados) {
  if (!isObject(dados) || !isId(dados.clienteId) ||
      !isObject(dados.medicamento) ||
      typeof dados.medicamento.nome !== 'string' || !dados.medicamento.nome.trim() || dados.medicamento.nome.length > 200 ||
      typeof dados.medicamento.registro !== 'string' || !dados.medicamento.registro.trim() || dados.medicamento.registro.length > 100 ||
      typeof dados.apresentacao !== 'string' || !dados.apresentacao.trim() || dados.apresentacao.length > 200 ||
      !Number.isSafeInteger(dados.intervaloCompraDias) || dados.intervaloCompraDias < 1 || dados.intervaloCompraDias > 36500 ||
      typeof dados.quantidade !== 'number' || !Number.isFinite(dados.quantidade) || dados.quantidade <= 0 || dados.quantidade > 2147483647 ||
      (dados.observacoes && (typeof dados.observacoes !== 'string' || dados.observacoes.length > 5000))) {
    return 'Cliente, medicamento validado, apresentação, quantidade e intervalo são obrigatórios.';
  }
  if (JSON.stringify(dados).length > 16000) return 'Cadastro de medicamento muito grande.';
  return null;
}
async function listar(req, res) {
  try {
    const cadastrados = await Medicamento.findAll({ where: { usuario_id: req.usuario.id }, order: [['id','ASC']] });
    return res.json(cadastrados.map(toPublic));
  } catch (error) { return errorResponse(error, res, 'listar medicamentos'); }
}
async function salvar(req, res) {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ mensagem: erro });
  const id = req.params.id;
  if (id !== undefined && !isId(id)) return res.status(400).json({ mensagem: 'ID inválido.' });
  try {
    const cliente = await Cliente.findOne({ where: { id: req.body.clienteId, usuario_id: req.usuario.id } });
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não pertence a esta conta.' });
    const { id: _id, ...dados } = req.body;
    dados.clienteNome = cliente.nome;
    if (id !== undefined) {
      const registro = await Medicamento.findOne({ where: { id, usuario_id: req.usuario.id } });
      if (!registro) return res.status(404).json({ mensagem: 'Cadastro não encontrado.' });
      await registro.update({ cliente_id: cliente.id, dados: JSON.stringify(dados) });
      return res.json(toPublic(registro));
    }
    const registro = await Medicamento.create({ usuario_id: req.usuario.id, cliente_id: cliente.id, dados: JSON.stringify(dados) });
    return res.status(201).json(toPublic(registro));
  } catch (error) { return errorResponse(error, res, 'salvar medicamento'); }
}
async function excluir(req, res) {
  if (!isId(req.params.id)) return res.status(400).json({ mensagem: 'ID inválido.' });
  try {
    const deleted = await Medicamento.destroy({ where: { id: req.params.id, usuario_id: req.usuario.id } });
    if (!deleted) return res.status(404).json({ mensagem: 'Cadastro não encontrado.' });
    return res.json({ mensagem: 'Cadastro excluído.' });
  } catch (error) { return errorResponse(error, res, 'excluir medicamento'); }
}
module.exports = { listar, salvar, excluir };
