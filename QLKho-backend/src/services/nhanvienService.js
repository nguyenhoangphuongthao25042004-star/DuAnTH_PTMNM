const { NhanVien, TaiKhoan, sequelize } = require('../models');
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');

const getAll = async(offset, limit) => {
    return await NhanVien.findAndCountAll({
      offset,
      limit,
      attributes: ['MaNV', 'HoTenNV', 'GioiTinh', 'ChucVu', 'TrangThai'],
      order: [['TrangThai', 'ASC'], ['MaNV', 'ASC']]
  });
};

const getById = async (MaNV) => {
  if(!MaNV) {throw new Error('Chưa có mã nhân viên');}
  return await NhanVien.findByPk(MaNV);
};

const create = async (data) => {
    const t = await sequelize.transaction();
    if(!data.MaNV) {throw new Error('Chưa nhập mã nhân viên');}
    try {
        const tontai = await NhanVien.findByPk(data.MaNV, { transaction: t });

        if (tontai) {
            throw new Error(`Mã nhân viên "${data.MaNV}" đã tồn tại`);
        }
        const nhanvien =  await NhanVien.create({
            MaNV: data.MaNV,
            HoTenNV: data.HoTenNV,
            ChucVu: data.ChucVu,
            GioiTinh: data.GioiTinh,
            NgaySinh: data.NgaySinh,
            QueQuan: data.QueQuan,
            CCCD: data.CCCD,
            DiaChi: data.DiaChi,
            SDT: data.SDT,
            Email: data.Email,
            TrangThai: 'active'
        }, { transaction: t});

        const ma = data.MaNV.toLowerCase();
        const hashedPassword = await bcrypt.hash(ma, 10);
        const taikhoan = await TaiKhoan.create({
            UserName: ma,
            MatKhau: hashedPassword,
            PhanQuyen: 'nhanvien',
            MaNV: data.MaNV,
            TrangThai: 'active'
        }, { transaction: t});
        
        await t.commit();
        return {nhanvien, taikhoan};
    } catch(err) {
        await t.rollback();
        throw err;
    }
};

const update = async (MaNV, data) => {
  const nhanVien = await NhanVien.findByPk(MaNV);
  if (!nhanVien) {
    throw new Error('Không tìm thấy nhân viên để cập nhật');
  }

  await NhanVien.update(data, { where: { MaNV } });
  return await NhanVien.findByPk(MaNV);

};

const remove = async (MaNV) => {
  const t = await sequelize.transaction();
  try {
    const nv = await NhanVien.findByPk(MaNV, { transaction: t });
    if (!nv) throw new Error('Không tìm thấy nhân viên');

    const acc = await TaiKhoan.findByPk(MaNV, { transaction: t });
    if (acc) {
      await acc.update({ TrangThai: 'inactive' }, { transaction: t });
    }

    await nv.update({ TrangThai: 'inactive' }, { transaction: t });
    await t.commit();
    return;

  } catch (err) {
    await t.rollback();
    throw err;
  }
}

const findByMaNVOrTen = async (keyword, offset, limit) => {
  const where = {
    [Op.or]: [
      { MaNV: {[Op.like]: `%${keyword}%`} },
      { HoTenNV: {[Op.like]: `%${keyword}%`} }
    ]
  };

  return await NhanVien.findAndCountAll({
    where,
    offset,
    limit,
    attributes: ['MaNV', 'HoTenNV', 'GioiTinh', 'ChucVu', 'TrangThai'],
    order: [['TrangThai', 'ASC'], ['MaNV', 'ASC']]
  });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  findByMaNVOrTen,
};