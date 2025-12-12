const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Phieunhap', {
    MaPN: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    NgayNhap: {
      type: DataTypes.DATE,
      allowNull: true
    },
    TongThanhTien: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    HinhThucThanhToan: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    MaNV: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'nhanvien',
        key: 'MaNV'
      }
    },
    MaNCC: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'nhacungcap',
        key: 'MaNCC'
      }
    },
    TrangThai: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'phieunhap',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPN" },
        ]
      },
      {
        name: "MaPN",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPN" },
        ]
      },
      {
        name: "MaNV",
        using: "BTREE",
        fields: [
          { name: "MaNV" },
        ]
      },
      {
        name: "MaNCC",
        using: "BTREE",
        fields: [
          { name: "MaNCC" },
        ]
      },
    ]
  });
};
