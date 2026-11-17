const express = require('express');
const router = express.Router();

const alertaController = require('../controllers/alertaController');
const autenticar = require('../middlewares/autenticacao');
/**
 * @swagger
 * /alertas:
 *   post:
 *     summary: Cadastrar novo alerta
 *     tags: [Alertas]
 *     responses:
 *       201:
 *         description: Alerta cadastrado
 *   get:
 *     summary: Listar alertas
 *     tags: [Alertas]
 *     responses:
 *       200:
 *         description: Lista de alertas
 *
 * /alertas/{id}:
 *   get:
 *     summary: Consultar alerta por ID
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alerta encontrado
 *   patch:
 *     summary: Atualizar alerta
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alerta atualizado
 *
 * /alertas/{id}/cancelar:
 *   patch:
 *     summary: Cancelar alerta
 *     tags: [Alertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alerta cancelado
 */
router.use(autenticar);

router.post('/', alertaController.cadastrar);
router.get('/', alertaController.listar);
router.get('/:id', alertaController.consultarPorId);
router.patch('/:id', alertaController.atualizar);
router.patch('/:id/cancelar', alertaController.cancelar);

module.exports = router;
