const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email: email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "Credenciales duplicadas",
      });
    }

    const usuario = new Usuario(req.body);

    //encriptar contrasenia
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Generar mi JWT
    const token = await generarJWT(usuario.id);

    //Guardar usuario en base de datos
    await usuario.save();

    //respuesta json del consumo del servicio
    res.json({ ok: true, usuario, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email: email });
    if (!existeEmail) {
      return res.status(403).json({
        ok: false,
        msg: "El usuario no esta registrado",
      });
    }

    const usuario = new Usuario(res.body);

    // //encriptar contrasenia
    // const salt = bcrypt.genSaltSync();
    // usuario.password = bcrypt.hashSync(password, salt);

    // //Generar mi JWT
    // const token = await generarJWT(usuario.id);

    // //Guardar usuario en base de datos
    // await usuario.save();

    //respuesta json del consumo del servicio
    res.json({ ok: true, usuario, token });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      ok: false,
      msg: "Error al iniciar sesion",
    });
  }
};

module.exports = {
  crearUsuario,
  login,
};
