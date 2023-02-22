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
    const usuarioDB = await Usuario.findOne({ email: email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "El usuario no esta registrado",
      });
    }

    //validar password
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Credenciales incorrectas",
      });
    }

    //generar el JWT
    const token = await generarJWT(usuarioDB.id);

    //respuesta en caso de login exitoso

    res.json({ ok: true, usuarioDB, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comuniquese con el administrador",
    });
  }
};

const renewToken = async (req, res = response) => {
  //Este uid fue envaido desde el midleware validar-jwts
  const uid = req.uid;

  //Generar nuevo jwt.
  const token = await generarJWT(uid);

  //Obtener el usuario desde la base de datos por el UID, Usuario
  //(La interfaz usuario esta ligada con mongoose)
  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    usuario,
    token,
  });
};

module.exports = {
  crearUsuario,
  login,
  renewToken,
};
