const express = require('express');
const router = express.Router({ mergeParams: true });

const itemPedidoController = require('../controllers/itemPedidoController');
const autenticar = require('../middlewares/autenticacao');
/**
 * @swagger
 * /pedidos/{pedidoId}/itens:
 *   post:
 *     summary: Cadastrar item no pedido
 *     tags: [Itens de pedidos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Item cadastrado
 *   get:
 *     summary: Listar itens de um pedido
 *     tags: [Itens de pedidos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de itens
 *
 * /pedidos/{pedidoId}/itens/{itemId}:
 *   get:
 *     summary: Consultar item por ID
 *     tags: [Itens de pedidos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item encontrado
 *   put:
 *     summary: Atualizar item do pedido
 *     tags: [Itens de pedidos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item atualizado
 *   patch:
 *     summary: Cancelar ou concluir item do pedido
 *     tags: [Itens de pedidos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Situação do item atualizada
 */
router.use(autenticar);

router.post('/', itemPedidoController.cadastrar);
router.get('/', itemPedidoController.listarPorPedido);
router.get('/:itemId', itemPedidoController.consultarPorId);
router.put('/:itemId', itemPedidoController.atualizar);
router.patch('/:itemId/cancelar', itemPedidoController.cancelar);
router.patch('/:itemId/concluir', itemPedidoController.concluir);

module.exports = router;
