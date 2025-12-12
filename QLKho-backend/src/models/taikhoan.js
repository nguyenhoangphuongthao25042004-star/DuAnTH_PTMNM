const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Taikhoan', {
    UserName: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    MatKhau: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PhanQuyen: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    MaNV: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'nhanvien',
        key: 'MaNV'
      },
      unique: "taikhoan_ibfk_1"
    },
    TrangThai: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'taikhoan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "UserName" },
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
