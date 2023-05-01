const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('compra', {
        idcompra: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        usuari: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        producte_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        oferta: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        quantitat:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        data: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'compra',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "idcompra" },
                ]
            },
        ]
    })
}