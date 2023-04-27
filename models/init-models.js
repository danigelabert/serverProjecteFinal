var DataTypes = require("sequelize").DataTypes;
var _producte = require("./producte");

function initModels(sequelize) {
  var producte = _producte(sequelize, DataTypes);


  return {
    producte,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
