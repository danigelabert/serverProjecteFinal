const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('producte', {
    prod_codi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    prod_nom: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    prod_infoenvio: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    prod_preu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    prod_tipus: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    oferta: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'producte',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "prod_codi" },
        ]
      },
    ]
  });
};
