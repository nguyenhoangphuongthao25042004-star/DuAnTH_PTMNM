const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Chitietphieunhap', {
    MaPN: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'phieunhap',
        key: 'MaPN'
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
    DonGia: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    ThanhTien: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    GhiChu: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chitietphieunhap',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPN" },
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
