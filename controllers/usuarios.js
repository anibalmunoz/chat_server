const { response } = require("express");
const Usuario = require("../models/usuario");

const getUsuarios = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;

  const usuarios = await Usuario.find({
    _id: { $ne: req.uid }, //ESTA LINEA FILTRA A LOS USUARIOSA Y DEVUELVE TODOS LOS QUE NO TENGAN EL ID DEL QUE INICIÓ LA SESIÓN
  })
    .sort("-online")
    .skip(desde) //DESDE SE ENCARGA DE MOSTRAR LOS DATOS DESDE UN NUMERO DEFINIDO
    .limit(20);

  res.json({
    ok: true,
    mrg: "getUsuario",
    usuarios,
    // desde,
  });
};

module.exports = {
  getUsuarios,
};
