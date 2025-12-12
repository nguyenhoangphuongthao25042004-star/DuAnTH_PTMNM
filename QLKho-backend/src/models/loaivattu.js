const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Loaivattu', {
    MaLoai: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    TenLoai: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'loaivattu',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaLoai" },
        ]
      },
      {
        name: "MaLoai",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaLoai" },
        ]
      },
    ]
  });
};
