const router = require('express').Router();
const autenticar = require('../middlewares/autenticacao');
const compras = require('../controllers/comprasController');
router.use(autenticar);
router.get('/', compras.listar);
router.post('/', compras.cadastrar);
module.exports = router;
