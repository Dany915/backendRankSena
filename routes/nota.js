const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { 
    notaPost,
    generarRanking,
    registrarNotas,
    generarRankingFicha,
    notasEstudiante,
    generarEstadisticas,
    obtenerNotasPorAreaDeEstudiante,
    generarRankingCurso,
  } = require('../controllers/nota');

const router = Router();

router.post('/',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], notaPost);

router.get('/ranking/top10/:numeroFicha',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], generarRankingCurso);

router.get('/ranking',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], generarRanking);

router.get('/estadisticas/:identificacion',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], generarEstadisticas);

router.get('/estadistica/estudiante/:identificacion/:area',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], obtenerNotasPorAreaDeEstudiante);

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