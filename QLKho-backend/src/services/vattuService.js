const { VatTu } = require('../models');
const { Op } = require('sequelize');

const getAll = async(offset, limit) => {
  return await VatTu.findAndCountAll({
    offset,
    limit,
    attributes: ['MaVT', 'TenVT', 'DonViTinh', 'SoLuong', 'TrangThai'],
    order: [['TrangThai', 'ASC'], ['MaVT', 'ASC']]
  });
};

const getById = async (MaVT) => {
  if(!MaVT) {throw new Error('Chưa có mã vật tư');}
  return await VatTu.findByPk(MaVT);
};

const create = async (data) => {
  if(!data.MaVT) {throw new Error('Chưa nhập mã vật tư');}
  const tontai = await VatTu.findByPk(data.MaVT);
  
  if (tontai) {
    throw new Error(`Mã vật tư "${data.MaVT}" đã tồn tại`);
  }

  return await VatTu.create({
    MaVT: data.MaVT,
    TenVT: data.TenVT,
    DonViTinh: data.DonViTinh,
    SoLuong: 0,
    DonGiaNhap: data.DonGiaNhap,
    DonGiaXuat: data.DonGiaXuat,
    TrangThai: 'Hết hàng',
    MaLoai: data.MaLoai,
    MaChoChua: data.MaChoChua
  });

};

const update = async (MaVT, data) => {
  const vatTu = await VatTu.findByPk(MaVT);
  if (!vatTu) {
    throw new Error('Không tìm thấy vật tư để cập nhật');
  }

  await VatTu.update(data, { where: { MaVT } });
  return await VatTu.findByPk(MaVT);

};

const remove = async (MaVT) => {
  const vatTu = await VatTu.findByPk(MaVT);
  if (!vatTu) {
    throw new Error('Không tìm thấy vật tư');
  }
  if (vatTu.SoLuong > 0) {
    throw new Error('Không thể xoá vì số lượng còn tồn');
  }
  return await VatTu.update({ TrangThai: 'Ngừng' }, { where: { MaVT } });
};

const findByMaVTOrTen = async (keyword, offset, limit) => {
  const where = {
    [Op.or]: [
      { MaVT: { [Op.like]: `%${keyword}%` } },
      { TenVT: { [Op.like]: `%${keyword}%` } }
    ]
  };

  return await VatTu.findAndCountAll({
    where,
    offset,
    limit,
    attributes: ['MaVT', 'TenVT', 'DonViTinh', 'SoLuong', 'TrangThai'],
    order: [['TrangThai', 'ASC'], ['MaVT', 'ASC']],
  });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  findByMaVTOrTen,
};