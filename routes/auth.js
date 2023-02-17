/*

path:  api/login

*/

const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, login } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const router = Router();

router.post(
  "/new",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").not().isEmpty().isEmail(),
    check(
      "password",
      "La contrasena es obligatoria y debe cumplir con lo siguiente:  8 caracteres, 1 minuscula, 1 numero, 1 simbolo"
    )
      .not()
      .isEmpty()
      .isStrongPassword(),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  "/",
  [
    check("email", "El email es obligatorio").not().isEmpty().isEmail(),
    check("password", "La contrasena es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

module.exports = router;
