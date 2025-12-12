const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Phieuxuat', {
    MaPX: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    NgayXuat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LyDoXuat: {
      type: DataTypes.STRING(100),
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
    TrangThai: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'phieuxuat',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPX" },
        ]
      },
      {
        name: "MaPX",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPX" },
        ]
      },
      {
        name: "MaNV",
        using: "BTREE",
        fields: [
          { name: "MaNV" },
        ]
      },
    ]
  });
};
