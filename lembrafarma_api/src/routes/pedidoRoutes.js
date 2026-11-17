const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedidoController');
const itemPedidoRoutes = require('./itemPedidoRoutes');
const autenticar = require('../middlewares/autenticacao');

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cadastrar novo pedido
 *     tags: [Pedidos]
 *     responses:
 *       201:
 *         description: Pedido cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *   get:
 *     summary: Listar pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *
 * /pedidos/{id}:
 *   get:
 *     summary: Consultar pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 *   put:
 *     summary: Atualizar pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *   patch:
 *     summary: Cancelar pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido cancelado
 */
router.use(autenticar);

router.post('/', pedidoController.cadastrar);
router.get('/', pedidoController.listar);
router.get('/:id', pedidoController.consultarPorId);
router.put('/:id', pedidoController.atualizar);
router.patch('/:id/cancelar', pedidoController.cancelar);
router.use('/:pedidoId/itens', itemPedidoRoutes);

module.exports = router;
