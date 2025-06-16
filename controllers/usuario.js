const { response } = require('express');


const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const vacio = async ( req, res = response ) => {
    
}

const usuarioPost = async ( req, res = response ) => {
    try {
    const { nombre, apellido, email, password, rol } = req.body;

    // Verificar si ya existe el correo
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      rol,
      password: hash
    });

    await nuevoUsuario.save();

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      data: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
}


module.exports = {

    usuarioPost,

}
