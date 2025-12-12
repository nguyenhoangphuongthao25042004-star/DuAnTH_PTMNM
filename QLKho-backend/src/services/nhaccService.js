const { NhaCungCap, ChiTietPhieuNhap, PhieuNhap, VatTu } = require('../models');
const { Op } = require('sequelize');

const getAll = async(offset, limit) => {
  return await NhaCungCap.findAndCountAll({
    offset,
    limit,
    attributes: ['MaNCC', 'TenNCC', 'DiaChi'],
    order: [['MaNCC', 'ASC']],
  });
};

const getById = async (MaNCC) => {
  if(!MaNCC) {throw new Error('Chưa có mã nhà cung cấp');}
  return await NhaCungCap.findByPk(MaNCC);
};

const create = async (data) => {
  if(!data.MaNCC) {throw new Error('Chưa nhập mã nhà cung cấp');}
  const tontai = await NhaCungCap.findByPk(data.MaNCC);
  if (tontai) {
    throw new Error(`Mã nhà cung cấp "${data.MaNCC}" đã tồn tại`);
  }
  return await NhaCungCap.create({
    MaNCC: data.MaNCC,
    TenNCC: data.TenNCC,
    DiaChi: data.DiaChi,
    SDT: data.SDT,
    Email: data.Email,
    NguoiDaiDien: data.NguoiDaiDien,
  });

};

const update = async (MaNCC, data) => {
  const nhaCungCap = await NhaCungCap.findByPk(MaNCC);
  if (!nhaCungCap) {
    throw new Error('Không tìm thấy nhà cung cấp để cập nhật');
  }

  await NhaCungCap.update(data, { where: { MaNCC } });
  return await NhaCungCap.findByPk(MaNCC);
};

const findByMaNCCOrTen = async (keyword, offset, limit) => {
  const where = {
    [Op.or]: [
      { MaNCC: { [Op.like]: `%${keyword}%` } },
      { TenNCC: { [Op.like]: `%${keyword}%` } }
    ]
  };

  return await NhaCungCap.findAndCountAll({
    where,
    offset,
    limit,
    attributes: ['MaNCC', 'TenNCC', 'DiaChi'],
    order: [['MaNCC', 'ASC']]
  });
};

const supplierHistory = async (MaNCC) => {
  const { count, rows } = await ChiTietPhieuNhap.findAndCountAll({
      include: [
        {
          model: PhieuNhap,
          as: 'phieuNhap',        
          where: { MaNCC, TrangThai: 'Đã duyệt' },
          attributes: ['MaPN', 'NgayNhap']
        },
        {
          model: VatTu,
          as: 'vatTu',          
          attributes: ['MaVT', 'TenVT']
        }
      ],
      attributes: ['MaPN', 'MaVT', 'SoLuong', 'DonGia', 'ThanhTien', 'GhiChu'],
      order: [
        [{ model: PhieuNhap, as: 'phieuNhap' }, 'NgayNhap', 'DESC'],
        ['MaVT', 'ASC']
      ]
    });

  const result = [];
  for (const r of rows) {
    const pn = r.phieuNhap || null;
    const vt = r.vatTu || null;
    result.push({
      MaPN: r.MaPN,
      NgayNhap: pn ? formatUTC(pn.NgayNhap) : null,
      MaVT: r.MaVT,
      TenVT: vt ? vt.TenVT : null,
      SoLuong: r.SoLuong,
      DonGia: r.DonGia,
      ThanhTien: r.ThanhTien,
      GhiChu: r.GhiChu || null
    });
  }
  return {
    count,
    data: result
  }
};

const formatUTC = (date) => {
  const iso = new Date(date).toISOString(); // ví dụ: 2025-10-10T09:30:00.000Z
  return iso.slice(0, 16).replace('T', ' ');
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  findByMaNCCOrTen,
  supplierHistory
};