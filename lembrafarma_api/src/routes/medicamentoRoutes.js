const router = require('express').Router();
const autenticacao = require('../middlewares/autenticacao');
const controller = require('../controllers/medicamentoController');
router.use(autenticacao);
router.get('/', controller.listar);
router.post('/', controller.salvar);
router.put('/:id', controller.salvar);
router.delete('/:id', controller.excluir);
module.exports = router;
