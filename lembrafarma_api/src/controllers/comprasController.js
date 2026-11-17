'use strict';

const { Cliente, Pedido, ItemPedido, Alerta, sequelize } = require('../models');
const { isId, isObject, errorResponse } = require('../utils/api');

function dataValida(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return y >= 1000 && date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function proximaData(data, intervalo) {
  const [year, month, day] = data.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + intervalo)).toISOString().slice(0, 10);
}

function formatar(pedido, item) {
  const cliente = pedido.cliente;
  return {
    id: item.id,
    pedidoId: pedido.id,
    clienteId: cliente.id,
    cliente: cliente.nome,
    telefone: cliente.telefone || '',
    contato: cliente.telefone || cliente.email || 'Pendente',
    produto: item.nome_medicamento,
    dosagem: item.dosagem || '',
    quantidadeCaixas: item.quantidade,
    dataCompra: item.data_compra,
    duracao: item.intervalo_recompra_dias,
    dataRecompra: item.proxima_recompra,
    status: item.status
  };
}

async function listar(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      where: { usuario_id: req.usuario.id },
      include: [
        { model: Cliente, as: 'cliente', required: true, where: { usuario_id: req.usuario.id } },
        { model: ItemPedido, as: 'itens', required: false, where: { status: 'ativo' } }
      ],
      order: [['id', 'DESC']]
    });
    return res.json({ compras: pedidos.flatMap(pedido =>
      pedido.status === 'cancelado' ? [] : pedido.itens.map(item => formatar(pedido, item))
    ) });
  } catch (error) {
    return errorResponse(error, res, 'listar compras');
  }
}

async function cadastrar(req, res) {
  if (!isObject(req.body)) return res.status(400).json({ mensagem: 'Informe os dados da compra.' });
  const { clienteId, produto, dosagem, quantidadeCaixas, dataCompra, duracao } = req.body;
  if (!isId(clienteId) || typeof produto !== 'string' || !produto.trim() || produto.trim().length > 200 ||
      typeof dosagem !== 'string' || dosagem.length > 80 ||
      !Number.isSafeInteger(quantidadeCaixas) || quantidadeCaixas < 1 || quantidadeCaixas > 2147483647 ||
      !Number.isSafeInteger(duracao) || duracao < 1 || duracao > 36500 || !dataValida(dataCompra)) {
    return res.status(400).json({ mensagem: 'Informe cliente, medicamento, dosagem, quantidade, data e intervalo válidos.' });
  }
  const dataRecompra = proximaData(dataCompra, duracao);
  try {
    const compra = await sequelize.transaction(async transaction => {
      const cliente = await Cliente.findOne({ where: { id: clienteId, usuario_id: req.usuario.id }, transaction });
      if (!cliente) return null;
      const pedido = await Pedido.create({
        usuario_id: req.usuario.id, cliente_id: cliente.id,
        data_pedido: `${dataCompra}T12:00:00.000Z`, status: 'aprovado'
      }, { transaction });
      const item = await ItemPedido.create({
        pedido_id: pedido.id, nome_medicamento: produto.trim(), dosagem,
        quantidade: quantidadeCaixas, intervalo_recompra_dias: duracao,
        data_compra: dataCompra, proxima_recompra: dataRecompra, status: 'ativo'
      }, { transaction });
      await Alerta.create({
        cliente_id: cliente.id, item_pedido_id: item.id, data_prevista: dataRecompra,
        tipo_alerta: 'recompra', status: 'pendente',
        mensagem: `Olá ${cliente.nome}, sua recompra de ${produto.trim()} está prevista para ${dataRecompra}.`
      }, { transaction });
      pedido.cliente = cliente;
      return formatar(pedido, item);
    });
    if (!compra) return res.status(404).json({ mensagem: 'Cliente não encontrado nesta conta.' });
    return res.status(201).json({ mensagem: 'Compra registrada no banco de dados.', compra });
  } catch (error) {
    return errorResponse(error, res, 'registrar compra');
  }
}

module.exports = { listar, cadastrar };
