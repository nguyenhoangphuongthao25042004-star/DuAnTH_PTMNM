const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Chitietphieusapxep', {
    MaPSX: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'phieusapxep',
        key: 'MaPSX'
      }
    },
    MaVT: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'vattu',
        key: 'MaVT'
      }
    },
    MaChoChua: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'chochua',
        key: 'MaChoChua'
      }
    },
    GhiChu: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chitietphieusapxep',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPSX" },
          { name: "MaVT" },
          { name: "MaChoChua" },
        ]
      },
      {
        name: "MaVT",
        using: "BTREE",
        fields: [
          { name: "MaVT" },
        ]
      },
      {
        name: "MaChoChua",
        using: "BTREE",
        fields: [
          { name: "MaChoChua" },
        ]
      },
    ]
  });
};
