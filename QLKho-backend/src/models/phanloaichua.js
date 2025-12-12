const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Phanloaichua', {
    MaPLC: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    TenPLC: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'phanloaichua',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPLC" },
        ]
      },
    ]
  });
};
