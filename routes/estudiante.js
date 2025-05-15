const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { 
    estPost,
    estPostLista,
    estGet,
    estGetCurso,
    estPut,    
  } = require('../controllers/estudiante');

const router = Router();

router.post('/',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], estPost);

router.post('/lista',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], estPostLista);

router.get('/',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], estGet);

router.get('/ficha/:numeroFicha',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], estGetCurso);

router.put('/:id',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], estPut);

module.exports = router;