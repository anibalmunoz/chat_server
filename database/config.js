const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Base de datos conectada");
  } catch (error) {
    console.log(error);
    throw new Error(
      "Error en base de datos - comuniquese con el administrador"
    );
  }
};

module.exports = {
  dbConnection,
};
