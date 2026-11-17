const router = require('express').Router();
const autenticacao = require('../middlewares/autenticacao');
const controller = require('../controllers/medicamentoController');
/**
 * @swagger
 * /medicamentos:
 *   get:
 *     summary: Listar medicamentos
 *     tags: [Medicamentos]
 *     responses:
 *       200:
 *         description: Lista de medicamentos
 *   post:
 *     summary: Cadastrar medicamento
 *     tags: [Medicamentos]
 *     responses:
 *       201:
 *         description: Medicamento cadastrado
 *   put:
 *     summary: Atualizar medicamento
 *     tags: [Medicamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medicamento atualizado
 *   delete:
 *     summary: Excluir medicamento
 *     tags: [Medicamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Medicamento excluído
 */
router.use(autenticacao);
router.get('/', controller.listar);
router.post('/', controller.salvar);
router.put('/:id', controller.salvar);
router.delete('/:id', controller.excluir);
module.exports = router;
