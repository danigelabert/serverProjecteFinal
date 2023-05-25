var DataTypes = require("sequelize").DataTypes;
var _compra = require("./compra");
var _producte = require("./producte");

function initModels(sequelize) {
  var compra = _compra(sequelize, DataTypes);
  var producte = _producte(sequelize, DataTypes);


  return {
    compra,
    producte,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
