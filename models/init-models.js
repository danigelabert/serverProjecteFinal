var DataTypes = require("sequelize").DataTypes;
var _producte = require("./producte");
var _compra = require("./compra")

function initModels(sequelize) {
  var producte = _producte(sequelize, DataTypes);
  var compra = _compra(sequelize, DataTypes)

  return {
    producte,
    compra
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
