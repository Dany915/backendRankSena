const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { 
    cursoPost,
    cursosGet,
    cursoGet,
    cursoPut,
    cursoPatch,
    cursosEstadoGet
  } = require('../controllers/curso');

const router = Router();

router.post('/',[
    //check('usuario', 'No es un usuario válido').isMongoId(),
    //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
    validarCampos
], cursoPost);

router.get('/',[
  //check('usuario', 'No es un usuario válido').isMongoId(),
  //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
  validarCampos
], cursosGet);

router.get('/:id',[
  //check('usuario', 'No es un usuario válido').isMongoId(),
  //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
  validarCampos
], cursoGet);

router.put('/:id',[
  //check('usuario', 'No es un usuario válido').isMongoId(),
  //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
  validarCampos
], cursoPut);

router.patch('/:id/inactivar',[
  //check('usuario', 'No es un usuario válido').isMongoId(),
  //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
  validarCampos
], cursoPatch);

router.get('/estado/:estado',[
  //check('usuario', 'No es un usuario válido').isMongoId(),
  //check('numeroFicha', 'El numero de ficha es obligatorio').not().isEmpty(),
  validarCampos
], cursosEstadoGet);

module.exports = router;