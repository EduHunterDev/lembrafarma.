const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController');
const autenticar = require('../middlewares/autenticacao');

router.use(autenticar);


/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cadastrar novo cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               telefone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente cadastrado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */

router.post('/', clienteController.cadastrar);

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Listar clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       401:
 *         description: Não autorizado
 */
router.get('/', clienteController.listar);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Consultar cliente por ID
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:id', clienteController.consultarPorId);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualizar cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *       404:
 *         description: Cliente não encontrado
 */

router.put('/:id', clienteController.atualizar);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Excluir cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente excluído
 *       404:
 *         description: Cliente não encontrado
 */

router.delete('/:id', clienteController.excluir);

module.exports = router;
