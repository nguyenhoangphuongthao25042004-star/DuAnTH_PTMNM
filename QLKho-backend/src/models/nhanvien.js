const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Nhanvien', {
    MaNV: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    HoTenNV: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ChucVu: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    GioiTinh: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    NgaySinh: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    QueQuan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CCCD: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    DiaChi: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SDT: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    TrangThai: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'nhanvien',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNV" },
        ]
      },
      {
        name: "MaNV",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNV" },
        ]
      },
    ]
  });
};
