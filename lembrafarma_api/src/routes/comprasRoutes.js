const router = require('express').Router();
const autenticar = require('../middlewares/autenticacao');
const compras = require('../controllers/comprasController');
/**
 * @swagger
 * /compras:
 *   get:
 *     summary: Listar compras
 *     tags: [Compras]
 *     responses:
 *       200:
 *         description: Lista de compras
 *   post:
 *     summary: Cadastrar nova compra
 *     tags: [Compras]
 *     responses:
 *       201:
 *         description: Compra cadastrada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.use(autenticar);
router.get('/', compras.listar);
router.post('/', compras.cadastrar);
module.exports = router;
