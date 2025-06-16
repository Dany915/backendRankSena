const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { 
    notaPost,
    generarRanking,
    registrarNotas,
    generarRankingFicha,
    notasEstudiante,
  } = require('../controllers/nota');

const router = Router();

router.post('/',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], notaPost);

router.get('/ranking',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], generarRanking);

router.get('/ranking/:numeroFicha',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], generarRankingFicha);

router.post('/masivo',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], registrarNotas);

router.get('/estudiante/:idEstudiante',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], notasEstudiante);

module.exports = router;