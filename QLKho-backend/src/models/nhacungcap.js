const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Nhacungcap', {
    MaNCC: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    TenNCC: {
      type: DataTypes.STRING(50),
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
    NguoiDaiDien: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'nhacungcap',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNCC" },
        ]
      },
      {
        name: "MaNCC",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaNCC" },
        ]
      },
    ]
  });
};
