const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Vattu', {
    MaVT: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    TenVT: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    DonViTinh: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    SoLuong: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DonGiaNhap: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    DonGiaXuat: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    TrangThai: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    MaLoai: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'loaivattu',
        key: 'MaLoai'
      }
    },
    MaChoChua: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'chochua',
        key: 'MaChoChua'
      }
    }
  }, {
    sequelize,
    tableName: 'vattu',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaVT" },
        ]
      },
      {
        name: "MaVT",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaVT" },
        ]
      },
      {
        name: "MaLoai",
        using: "BTREE",
        fields: [
          { name: "MaLoai" },
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
