const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const DataTypes = Sequelize.DataTypes;

// Định nghĩa model
const NhanVienModel = require('./nhanvien');
const NhaCungCapModel = require('./nhacungcap');
const LoaiVatTuModel = require('./loaivattu');
const PhanLoaiChuaModel = require('./phanloaichua');
const ChoChuaModel = require('./chochua');
const VatTuModel = require('./vattu');
const PhieuNhapModel = require('./phieunhap');
const ChiTietPhieuNhapModel = require('./chitietphieunhap');
const PhieuXuatModel = require('./phieuxuat');
const ChiTietPhieuXuatModel = require('./chitietphieuxuat');
const PhieuSapXepModel = require('./phieusapxep');
const ChiTietPhieuSapXepModel = require('./chitietphieusapxep');
const TaiKhoanModel = require('./taikhoan');

// Gọi định nghĩa
const NhanVien = NhanVienModel(sequelize, DataTypes);
const NhaCungCap = NhaCungCapModel(sequelize, DataTypes);
const LoaiVatTu = LoaiVatTuModel(sequelize, DataTypes);
const PhanLoaiChua = PhanLoaiChuaModel(sequelize, DataTypes);
const ChoChua = ChoChuaModel(sequelize, DataTypes);
const VatTu = VatTuModel(sequelize, DataTypes);
const PhieuNhap = PhieuNhapModel(sequelize, DataTypes);
const ChiTietPhieuNhap = ChiTietPhieuNhapModel(sequelize, DataTypes);
const PhieuXuat = PhieuXuatModel(sequelize, DataTypes);
const ChiTietPhieuXuat = ChiTietPhieuXuatModel(sequelize, DataTypes);
const PhieuSapXep = PhieuSapXepModel(sequelize, DataTypes);
const ChiTietPhieuSapXep = ChiTietPhieuSapXepModel(sequelize, DataTypes);
const TaiKhoan = TaiKhoanModel(sequelize, DataTypes);

// Trả về object với các model
const db = {
  sequelize,                  // instance kết nối database
  Sequelize,                  // thư viện Sequelize (DataTypes, Op...)
  NhanVien,
  NhaCungCap,
  LoaiVatTu,
  PhanLoaiChua,
  ChoChua,
  VatTu,
  PhieuNhap,
  ChiTietPhieuNhap,
  PhieuXuat,
  ChiTietPhieuXuat,
  PhieuSapXep,
  ChiTietPhieuSapXep,
  TaiKhoan
};

// === Associations (đã chỉnh theo logic ràng buộc) ===



// PhanLoaiChua -> ChoChua 
PhanLoaiChua.hasMany(ChoChua, { foreignKey: 'MaPLC', as: 'choChuas' });
ChoChua.belongsTo(PhanLoaiChua, { foreignKey: 'MaPLC', as: 'phanLoai' });

// LoaiVatTu -> VatTu 
LoaiVatTu.hasMany(VatTu, { foreignKey: 'MaLoai', as: 'vatTus' });
VatTu.belongsTo(LoaiVatTu, { foreignKey: 'MaLoai', as: 'loai' });

// ChoChua -> VatTu 
ChoChua.hasMany(VatTu, { foreignKey: 'MaChoChua', as: 'vatTus' });
VatTu.belongsTo(ChoChua, { foreignKey: 'MaChoChua', as: 'choChua' });

// NhanVien -> PhieuNhap 
NhanVien.hasMany(PhieuNhap, { foreignKey: 'MaNV', as: 'phieuNhaps' });
PhieuNhap.belongsTo(NhanVien, { foreignKey: 'MaNV', as: 'nhanVien' });

// NhaCungCap -> PhieuNhap 
NhaCungCap.hasMany(PhieuNhap, { foreignKey: 'MaNCC', as: 'phieuNhaps' });
PhieuNhap.belongsTo(NhaCungCap, { foreignKey: 'MaNCC', as: 'nhaCungCap' });

// PhieuNhap -> ChiTietPhieuNhap 
PhieuNhap.hasMany(ChiTietPhieuNhap, { foreignKey: 'MaPN', as: 'chiTiets' });
ChiTietPhieuNhap.belongsTo(PhieuNhap, { foreignKey: 'MaPN', as: 'phieuNhap' });

// VatTu -> ChiTietPhieuNhap
VatTu.hasMany(ChiTietPhieuNhap, { foreignKey: 'MaVT', as: 'chiTietsPN' });
ChiTietPhieuNhap.belongsTo(VatTu, { foreignKey: 'MaVT', as: 'vatTu' });

// NhanVien -> PhieuXuat
NhanVien.hasMany(PhieuXuat, { foreignKey: 'MaNV', as: 'phieuXuats' });
PhieuXuat.belongsTo(NhanVien, { foreignKey: 'MaNV', as: 'nhanVien' });

// PhieuXuat -> ChiTietPhieuXuat 
PhieuXuat.hasMany(ChiTietPhieuXuat, { foreignKey: 'MaPX', as: 'chiTiets' });
ChiTietPhieuXuat.belongsTo(PhieuXuat, { foreignKey: 'MaPX', as: 'phieuXuat' });

// VatTu -> ChiTietPhieuXuat 
VatTu.hasMany(ChiTietPhieuXuat, { foreignKey: 'MaVT', as: 'chiTietsPX' });
ChiTietPhieuXuat.belongsTo(VatTu, { foreignKey: 'MaVT', as: 'vatTu' });

// NhanVien -> PhieuSapXep 
NhanVien.hasMany(PhieuSapXep, { foreignKey: 'MaNV', as: 'phieuSapXeps' });
PhieuSapXep.belongsTo(NhanVien, { foreignKey: 'MaNV', as: 'nhanVien' });

// PhieuSapXep -> ChiTietPhieuSapXep 
PhieuSapXep.hasMany(ChiTietPhieuSapXep, { foreignKey: 'MaPSX', as: 'chiTiets' });
ChiTietPhieuSapXep.belongsTo(PhieuSapXep, { foreignKey: 'MaPSX', as: 'phieuSapXep' });

// VatTu -> ChiTietPhieuSapXep 
VatTu.hasMany(ChiTietPhieuSapXep, { foreignKey: 'MaVT', as: 'chiTietsPSX' });
ChiTietPhieuSapXep.belongsTo(VatTu, { foreignKey: 'MaVT', as: 'vatTu' });

// ChoChua -> ChiTietPhieuSapXep 
ChoChua.hasMany(ChiTietPhieuSapXep, { foreignKey: 'MaChoChua', as: 'chiTietsPSX' });
ChiTietPhieuSapXep.belongsTo(ChoChua, { foreignKey: 'MaChoChua', as: 'choChua' });

// NhanVien -> TaiKhoan 
NhanVien.hasOne(TaiKhoan, { foreignKey: 'MaNV', as: 'taiKhoan' });
TaiKhoan.belongsTo(NhanVien, { foreignKey: 'MaNV', as: 'nhanVien' });

module.exports = db;
