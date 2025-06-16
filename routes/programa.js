const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { crearPrograma } = require('../controllers/programa');

const router = Router();

router.post('/',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], crearPrograma);

module.exports = router;