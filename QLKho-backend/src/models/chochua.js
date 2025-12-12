const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Chochua', {
    MaChoChua: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    TenChoChua: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    SucChua: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    TinhTrangChua: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    MaPLC: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'phanloaichua',
        key: 'MaPLC'
      }
    }
  }, {
    sequelize,
    tableName: 'chochua',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaChoChua" },
        ]
      },
      {
        name: "MaChoChua",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaChoChua" },
        ]
      },
      {
        name: "MaPLC",
        using: "BTREE",
        fields: [
          { name: "MaPLC" },
        ]
      },
    ]
  });
};
