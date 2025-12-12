const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Phieusapxep', {
    MaPSX: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    NgayLap: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LyDo: {
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
    tableName: 'phieusapxep',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPSX" },
        ]
      },
      {
        name: "MaPSX",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaPSX" },
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
