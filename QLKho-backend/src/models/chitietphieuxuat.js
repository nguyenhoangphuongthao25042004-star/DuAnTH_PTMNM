const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Chitietphieuxuat', {
    MaPX: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'phieuxuat',
        key: 'MaPX'
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
    SoLuong: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DonGiaXuat: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    GhiChu: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chitietphieuxuat',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPX" },
          { name: "MaVT" },
        ]
      },
      {
        name: "MaVT",
        using: "BTREE",
        fields: [
          { name: "MaVT" },
        ]
      },
    ]
  });
};
